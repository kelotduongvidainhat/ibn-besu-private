# 🔄 Fresh Start Guide

This document explains why a "Fresh Start" is complex in a private blockchain environment and how to perform one correctly.

## ❓ Why is it complex?

In a standard web app, you just restart the database. In the **Imperial Virtual Lab**, there are three layers that MUST stay in sync:

1.  **Blockchain Layer**: When you wipe the volumes (`docker-compose down -v`), the blockchain history is gone. The "Genesis" starts at block 0.
2.  **Contract Layer**: Any security contracts (like `AccountAllowlist`) that existed previously are now deleted. They must be re-deployed to the NEW chain.
3.  **Application Layer**: If the API keeps its old database while the blockchain is new, it will try to check permissions against addresses that don't exist anymore, leading to `BAD_DATA` errors.

---

## ⚡ The 1-Click Solution

I have provided a script `fresh-start.sh` in the root directory. It automates all the steps below.

```bash
bash fresh-start.sh
```

---

## 🛠️ Manual Step-by-Step (What the script does)

### 1. The Clean Sweep
First, stop everything and delete the local databases.
```bash
docker-compose down -v
rm app/database/lab.sqlite
```

### 2. Blockchain Initialization
Start only the Besu nodes first. They need time to find each other (Discovery) and start reaching consensus.
```bash
docker-compose up -d node1 node2 node3 node4
# Wait ~30 seconds
```

### 3. Identity Bootstrapping
You must deploy the "Security Gate" (`AccountAllowlist.sol`) to the new chain.
```bash
cd contracts
npx hardhat run scripts/deploy-permissioning.js --network besu
```
**Important**: Copy the new contract address from the output.

### 4. Configuration Sync
Update the following files with the NEW contract address:
- `app/.env`
- `docker-compose.yml`

### 5. Final Launch
Start the API and Monitoring tools, then run the registration script to put students back into the database and the new white-list.
```bash
docker-compose up -d
cd app
node scripts/register-students.js
```

---

## 🚑 Troubleshooting

- **Transactions are "Pending"**: This usually means the API is using an old `ACCOUNT_ALLOWLIST_ADDRESS`. Re-run the Fresh Start script.
- **Nodes Not Connecting**: Check `network/config/static-nodes.json`. These IPs must match the internal Docker network.
- **Prometheus Mounting Error**: If you see "mount failed: not a directory", it means the host filesystem created a folder where a file was expected. Run the reset script to clean it.
