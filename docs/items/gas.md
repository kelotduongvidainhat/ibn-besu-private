# Gas in Private Besu Networks

In a private Hyperledger Besu network, Gas management differs significantly from the Public Ethereum Mainnet.

## Core Concepts

### 1. Gas Price
In many private networks, the `min-gas-price` is set to `0`. This allows transactions to be processed without requiring participants to hold "valuable" Ether.
- **Command Flag**: `--min-gas-price=0`

### 2. Zero-Cost Transactions
Even if the gas price is zero, transactions still consume "Gas units" to prevent infinite loops (Halting Problem) and DoS attacks. The EVM still calculates the complexity of the execution.

### 3. Block Gas Limit
This defines the maximum amount of gas that can be spent in a single block. In private networks, this is often set much higher than Mainnet to allow for high-throughput or complex smart contracts.
- **Configuration**: Set in the `genesis.json` file under the `gasLimit` field.

### 4. Gas in MVP Context
For the `ibn-besu-private` MVP:
- **Free Gas Model**: `min-gas-price` is set to `0` to simplify student onboarding.
- **Realistic Block Limit**: Set to **30,000,000** (matching Ethereum Mainnet) to teach students the importance of contract optimization.
- **Monitoring**: Gas usage is tracked in the Teacher Dashboard for performance benchmarking.
