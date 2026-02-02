# Hybrid Data Architecture

The Imperial Virtual Lab utilizes a **Hybrid Data Model**. This design ensures high performance for identity management and session tracking while maintaining the cryptographic integrity of the blockchain for value and permissions.

---

## 1. Off-Chain Layer (Relational Database)
We use **SQLite** (via Sequelize ORM) for managing student identities and application-specific metadata.

### 📊 Table: `Students`
Stored in `app/database/lab.sqlite`.
| Field | Data Type | Purpose |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Internal Primary Key. |
| `mssv` | `STRING (Unique)` | **Student ID.** The unique identifier for login. |
| `name` | `STRING` | Student's full name. |
| `walletAddress` | `STRING` | The student's 0x... blockchain identity. |
| `privateKey` | `STRING` | The student's secret key (used for autonomous lab actions). |
| `lastClaimedAt`| `DATETIME` | Used to calculate the 24-hour reward cooldown. |

### 📝 Table: `Submissions`
Tracks contracts deployed by students for grading.
| Field | Data Type | Purpose |
| :--- | :--- | :--- |
| `contractAddress`| `STRING` | The address of the student's deployed contract. |
| `txHash` | `STRING` | Hash of the deployment transaction. |
| `status` | `STRING` | Flow status (e.g., `PENDING`, `SUBMITTED`, `GRADED`). |
| `grade` | `FLOAT` | Numerical grade assigned by the instructor. |
| `StudentId` | `INTEGER` | Foreign Key linking to the `Students` table. |

---

## 2. On-Chain Layer (Ledger State)
The **Hyperledger Besu** state is the "Single Source of Truth" for assets and network access.

### 💰 Native Assets (ETH)
Balances are stored directly in the blockchain's World State.
- **Entry**: `address => balance (uint256)`
- **Verification**: Can be queried via standard JSON-RPC (`eth_getBalance`).

### 🛡️ Permissioning State (`AccountAllowlist.sol`)
Stored in the state variables of the Permissioning Smart Contract.
- **Data Structure**: `mapping(address => bool) public isAllowed`
- **Purpose**: Controls the "On-Chain Firewall". Only addresses set to `true` can send transactions to the network.

---

## 3. Data Integration Flow
The Backend API (`app/server.js`) acts as a **Data Aggregator**:

1.  **Request**: User asks for Student Profile.
2.  **Fetch**: API retrieves Name and MSSV from **SQLite**.
3.  **Fetch**: API retrieves ETH Balance from **Besu Nodes**.
4.  **Fetch**: API retrieves Permission Status from **Allowlist Contract**.
5.  **Response**: API merges all sources into a single unified JSON object.

---
*Last Updated: February 2026*
