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

### Stop and Wipe Everything (Full Reset)
**WARNING**: This deletes the blockchain and the student database.
```bash
docker-compose down -v
rm app/database/lab.sqlite
```

## 📊 Monitoring & Logs

### View Real-time Logs (Node 1)
```bash
docker logs -f node1
```

### Check Peer Count (via Imperial Gateway)
```bash
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' \
localhost:5000/api/rpc/public
```

### Check Block Height
```bash
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
localhost:5000/api/rpc/public
```

## 🛠️ Application Layer

### Bootstrap / Restore State
If the network is reset, you must re-register the authorized students to link them to the new chain security contract.
```bash
cd app && node scripts/register-students.js
```

## 🚑 Disaster Recovery (Protocol Upgrade/Broken Consensus)

If the nodes fail to produce blocks or protocols are mismatched:

1.  **Wipe All State**:
    ```bash
    docker-compose down -v
    rm app/database/lab.sqlite
    # Manually clear host-mounted database folders if permission allows:
    # docker run --rm -v $(pwd)/network/data:/data alpine sh -c "rm -rf /data/*/database"
    ```
2.  **Verify Genesis**: Ensure `network/genesis/genesis.json` has correct fork blocks (e.g., `cancunblock: 0`).
3.  **Deploy Security**:
    ```bash
    cd contracts && npx hardhat run scripts/deploy-permissioning.js --network besu
    ```
4.  **Update Config**: Copy the new address into `app/.env` and `docker-compose.yml`.
5.  **Re-Register**: Run the restoration script in the Application Layer section.

## 🔐 Security Notes
- **Iron Shield**: Direct access to Besu nodes (8545) is disabled. All traffic MUST pass through the identity-aware proxy on port **5000**.
- **Static Nodes**: Discovery is handled via `network/config/static-nodes.json` to ensure stability in containerized environments.
