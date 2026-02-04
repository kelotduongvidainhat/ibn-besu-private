#!/bin/bash
set -e

echo "🛑 Stopping all services..."
docker-compose down -v --remove-orphans

echo "🧹 Wiping stateful data..."
rm -f app/database/lab.sqlite
# Clear Besu internal DBs (mounted on host)
docker run --rm -v $(pwd)/network/data:/data alpine sh -c "rm -rf /data/*/database /data/*/caches /data/*/besu.networks"

echo "⛓️ Starting Blockchain Nodes..."
docker-compose up -d node1 node2 node3 node4
echo "⏳ Waiting for consensus (30s)..."
sleep 30

echo "📜 Deploying Security Contract..."
# We utilize node1's temporary host port 8545 for deployment
cd contracts && npx hardhat run scripts/deploy-permissioning.js --network besu > deploy_result.txt
NEW_ADDR=$(grep "AccountAllowlist deployed to:" deploy_result.txt | awk '{print $NF}')
echo "✅ New Security Address: $NEW_ADDR"

if [ -z "$NEW_ADDR" ]; then
    echo "❌ Deployment failed! Check contracts/deploy_result.txt"
    exit 1
fi

echo "⚙️ Updating configurations..."
sed -i "s/ACCOUNT_ALLOWLIST_ADDRESS=.*/ACCOUNT_ALLOWLIST_ADDRESS=$NEW_ADDR/" ../app/.env
sed -i "s/ACCOUNT_ALLOWLIST_ADDRESS=.*/ACCOUNT_ALLOWLIST_ADDRESS=$NEW_ADDR/" ../docker-compose.yml
# Update docs
sed -i "s/AccountAllowlist.sol\` at \`0x[a-fA-F0-9]*\`/AccountAllowlist.sol\` at \`$NEW_ADDR\`/" ../docs/plans/05-account-permissioning.md

echo "🚀 Starting Imperial Gateway and Monitoring..."
cd ..
docker-compose up -d
sleep 15

echo "👤 Restoring Student Identities..."
cd app
node scripts/register-students.js

echo "✨ FRESH START COMPLETE! Environment is ready."
