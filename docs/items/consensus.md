# Consensus Protocols (QBFT/IBFT 2.0)

Private networks typically use Proof-of-Authority (PoA) consensus mechanisms rather than Proof-of-Work.

## QBFT (Quorum Byzantine Fault Tolerance)
QBFT is the recommended consensus for Hyperledger Besu private networks.

### Key Features:
- **Instant Finality**: Once a block is committed, it is final. There are no forks.
- **Fault Tolerance**: Can tolerate up to `(N-1)/3` faulty/malicious nodes.
- **Validator Set**: A predefined list of nodes (Validators) propose and vote on blocks.

## IBFT 2.0 (Istanbul Byzantine Fault Tolerance)
An older alternative to QBFT, still supported but generally superseded by QBFT due to better edge-case handling and security.

## Comparison for `ibn-besu-private`

| Feature | QBFT | IBFT 2.0 |
| :--- | :--- | :--- |
| **Finality** | Instant | Instant |
| **Resilience** | Higher | Standard |
| **Governance** | Dynamic validator voting | Dynamic validator voting |
| **Recommendation** | **Preferred** | Legacy |

## Voting and Governance
Validators can vote to add or remove other validators from the set while the network is running, providing flexible governance matching the Fabric-style "Consortium" model.
