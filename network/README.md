# Network Orchestration

This directory contains everything needed to bootstrap and manage the private Besu network.

## Directory Structure

- **[config/](./config/)**: Node-specific configuration files (`config.toml`). Each node should have its own configuration to handle port mapping and identity.
- **[genesis/](./genesis/)**: Genesis block definition (`genesis.json`). This defines the network ID, consensus algorithm (QBFT), and initial validator set.
- **[scripts/](./scripts/)**: Automation for:
    - Network startup/shutdown.
    - Key generation.
    - Genesis file generation.
    - Health checks.

## Key Principles

1. **Isolation**: Each node's data is stored in its own `data` directory (ignored by git).
2. **Reproducibility**: The genesis file should be the single source of truth for the chain's birth.
3. **Security**: Private keys are *never* committed to the repository.
