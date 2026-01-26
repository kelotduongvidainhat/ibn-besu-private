# Phase 1: 4-Node QBFT Network Setup

This document details the technical setup for the initial 4-node private Hyperledger Besu network.

## Network Specifications
- **Consensus**: QBFT (Quorum Byzantine Fault Tolerance).
- **Network ID**: 1337 (MVP Default).
- **Node Count**: 4 Validators.
- **Block Time**: 2 seconds.

## Node Identification (Host Perspective)
Each node will run in a container with the following port mappings for local access:

| Node | RPC Port | P2P Port | Role |
| :--- | :--- | :--- | :--- |
| Node 1 | 8545 | 30303 | Validator / Bootnode |
| Node 2 | 8546 | 30304 | Validator |
| Node 3 | 8547 | 30305 | Validator |
| Node 4 | 8548 | 30306 | Validator |

## Implementation Steps

### 1. Key Generation
We will use the `besu operator key generate` command to create a unique identity for each node.
- Each identity consists of a `key` (private) and `key.pub` (public).
- The `nodeAddress` is derived from `key.pub`.

### 2. Genesis Creation
The `genesis.json` will be initialized with:
- **Validators**: The 4 generated node addresses.
- **Gas Limit**: `0x1fffffffffffff` (Large for MVP).
- **Gas Price**: `0` (Free gas model).

### 3. Orchestration
Docker Compose will manage:
- Service networking.
- Volume mounting for configuration and data.
- Resource constraints.

## Success Criteria
- [ ] Nodes find each other via P2P discovery.
- [ ] Block height increases consistently.
- [ ] Consensus is reached (block hash matches across nodes).
