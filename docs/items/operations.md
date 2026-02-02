# Operational Procedures

This guide provides the necessary commands to manage and monitor the **ibn-besu-private** network.

## 🚀 Network Management

### Start the Network
```bash
docker-compose up -d
```

### Stop the Network (Keep Data)
```bash
docker-compose stop
```

### Stop and Wipe Everything (Reset State)
```bash
docker-compose down -v
```

## 📊 Monitoring & Logs

### View Real-time Logs (Node 1)
```bash
docker logs -f node1
```

### Check Peer Count (via Node 1)
```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' localhost:8545
```

### Check Block Height
```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' localhost:8545
```

## 🛠️ Application Layer

### Bootstrap Demo State
Generates students, funds them with ETH, and initializes the lab ecosystem.
```bash
cd app && node scripts/bulk-init.js
```

### Run E2E Settlement Test
Executes the cross-party approval and settlement workflow.
```bash
cd app && node scripts/e2e-settlement.js
```

## 🔐 Security Notes
- **Private Keys**: Stored in `network/data/node{X}/key` and `app/.env`. 
- **TODO**: Transition `app/wallet/wallet-manager.js` to a proper KMS/Vault for production use.
