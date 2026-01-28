# Cryptography in Besu (secp256k1)

This document explains the cryptographic foundation of the identities used in the **ibn-besu-private** network.

## 1. Identity Derivation Pipeline

The transformation from a secret to a network identity follows a strictly defined mathematical path:

### Step A: The Private Key (Entropy)
*   **Tool**: `openssl rand -hex 32`
*   **Description**: A 256-bit (32-byte) random number. 
*   **Role**: This is the ultimate "secret." Anyone with this key has full control over the account and validator nodes.

### Step B: The Public Key (Elliptic Curve)
*   **Math**: The Private Key is used as a scalar multiplier for the **secp256k1** Elliptic Curve Generator Point ($G$).
*   **Formula**: $K = k \times G$
*   **Form**: Results in an $(x, y)$ coordinate pair (64 bytes).
*   **Verification**: This point is exported in our project as `key.pub`.

### Step C: The Address (Hashing)
*   **Algorithm**: **Keccak-256** (Note: Not SHA-3, though similar).
*   **Process**:
    1. Hash the 64-byte uncompressed public key.
    2. Take the **last 20 bytes** of the resulting hash.
    3. Prefix with `0x`.
*   **Role**: This is the "Public Address" used in `genesis.json` and for smart contract interactions.

## 2. Why we use two different tools

| Tool | Phase | Why? |
| :--- | :--- | :--- |
| **OpenSSL** | Entropy | Reliable and standardized way to generate raw random bytes on any Linux system. |
| **Besu CLI** | Derivation | Handles the specific math of secp256k1 and Keccak-256 to ensure the Address perfectly matches what the node expects. |

## 3. Key Encodings in Besu

- **Enode URLs**: Use the 64-byte Public Key for peer-to-peer discovery.
- **Validator Voting**: Uses the 20-byte Address to identify validators in the QBFT set.
- **Transaction Signing**: The Private Key is used to sign a Keccak-256 hash of the transaction data, which others verify using the Public Key.
