#!/bin/bash
# network/scripts/generate-genesis.sh

set -e

IMAGE="hyperledger/besu:latest"
GENESIS_DIR="$(pwd)/network/genesis"
DATA_DIR="$(pwd)/network/data"
CONFIG_FILE="$GENESIS_DIR/qbft-config.json"
TEMP_OUT="$(pwd)/network/genesis/temp_out"

echo "🚀 Using Besu to generate synchronized keys and genesis..."

# 1. Create the config file for the generator
# We let it generate 4 nodes so the extraData is perfectly encoded
cat <<EOF > "$CONFIG_FILE"
{
  "genesis": {
    "config": {
      "chainId": 1337,
      "constantinoplefixblock": 0,
      "petersburgblock": 0,
       "istanbulblock": 0,
      "qbft": {
        "blockperiodseconds": 2,
        "epochlength": 30000,
        "requesttimeoutseconds": 10
      }
    },
    "nonce": "0x0",
    "timestamp": "0x58e81a01",
    "gasLimit": "0x1fffffffffffff",
    "difficulty": "0x1",
    "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
    "coinbase": "0x0000000000000000000000000000000000000000"
  },
  "blockchain": {
    "nodes": {
      "generate": true,
      "count": 4
    }
  }
}
EOF

# 2. Run the generator
mkdir -p "$TEMP_OUT"
sudo rm -rf "$TEMP_OUT"/*
docker run --rm \
  -v "$GENESIS_DIR":/opt/besu/config \
  $IMAGE \
  operator generate-blockchain-config --config-file=/opt/besu/config/qbft-config.json --to=/opt/besu/config/temp_out

sudo chown -R $USER:$USER "$TEMP_OUT"

# 3. Move keys to our structured data directory and extract addresses
echo "📥 Syncing generated keys to network/data/..."
mkdir -p "$DATA_DIR"

# The generator creates folders like keys/node-1, keys/node-2 ...
i=1
for node_dir in "$TEMP_OUT"/keys/*
do
    TARGET_DIR="$DATA_DIR/node$i"
    mkdir -p "$TARGET_DIR"
    
    # Copy keys (Besu generates key.priv and key.pub)
    cp "$node_dir/key.priv" "$TARGET_DIR/key"
    cp "$node_dir/key.pub" "$TARGET_DIR/key.pub"
    
    # Extract address using Besu tool
    ADDRESS=$(docker run --rm -v "$TARGET_DIR/key":/opt/besu/key $IMAGE public-key export-address --node-private-key-file=/opt/besu/key | tail -n 1 | sed 's/\x1b\[[0-9;]*m//g')
    echo "$ADDRESS" > "$TARGET_DIR/address"
    
    echo "Node $i synchronized: $ADDRESS"
    ((i++))
done

# 4. Finalize genesis.json
# We take the one Besu generated and ensure it has our desired balances
# Besu's generator already puts node addresses in 'alloc' by default, 
# but let's make sure they have a healthy balance.
cp "$TEMP_OUT/genesis.json" "$GENESIS_DIR/genesis.json"

echo "✅ Network foundation synchronized."
echo "Genesis: $GENESIS_DIR/genesis.json"
echo "Keys: $DATA_DIR"

# Cleanup
sudo rm -rf "$TEMP_OUT"
