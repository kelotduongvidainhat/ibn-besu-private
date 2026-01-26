#!/bin/bash
# network/scripts/generate-keys.sh

set -e

IMAGE="hyperledger/besu:latest"
DATA_DIR="$(pwd)/network/data"

echo "🚀 Generating keys and addresses for 4 nodes using OpenSSL and Besu..."

for i in {1..4}
do
    NODE_DIR="$DATA_DIR/node$i"
    mkdir -p "$NODE_DIR"
    
    # 1. Generate Private Key using OpenSSL
    openssl rand -hex 32 > "$NODE_DIR/key"
    
    # 2. Export Public Key using Besu
    # We use -v to mount the key file and a temp file for the output to avoid permission issues
    PUB_KEY=$(docker run --rm -v "$NODE_DIR/key":/opt/besu/key $IMAGE public-key export --node-private-key-file=/opt/besu/key | tail -n 1)
    echo "$PUB_KEY" > "$NODE_DIR/key.pub"
    
    # 3. Export Address using Besu
    ADDRESS=$(docker run --rm -v "$NODE_DIR/key":/opt/besu/key $IMAGE public-key export-address --node-private-key-file=/opt/besu/key | tail -n 1)
    echo "$ADDRESS" > "$NODE_DIR/address"
    
    # Fix permissions
    sudo chown -R $USER:$USER "$NODE_DIR"
    
    echo "Node $i Address: $ADDRESS"
done

echo "✅ Key generation complete."
