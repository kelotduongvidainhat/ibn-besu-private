#!/bin/bash
# network/scripts/finalize-foundation.sh

set -e

TEMP_OUT="$(pwd)/network/genesis/temp_out"
DATA_DIR="$(pwd)/network/data"
GENESIS_FILE="$(pwd)/network/genesis/genesis.json"

echo "🏁 Finalizing Network Foundation..."

# 1. Clean and Prepare Data Directory
mkdir -p "$DATA_DIR"
sudo rm -rf "$DATA_DIR/node"*

# 2. Map Keys to Node Structure
i=1
# We iterate through the address-named folders in temp_out/keys
for addr_dir in "$TEMP_OUT/keys/"0x*
do
    NODE_PATH="$DATA_DIR/node$i"
    mkdir -p "$NODE_PATH"
    
    ADDRESS=$(basename "$addr_dir")
    
    # Copy keys and address
    sudo cp "$addr_dir/key.priv" "$NODE_PATH/key"
    sudo cp "$addr_dir/key.pub" "$NODE_PATH/key.pub"
    echo "$ADDRESS" > "$NODE_PATH/address"
    
    echo "✅ Node $i configured with address: $ADDRESS"
    ((i++))
done

# 3. Create Final Genesis with allocations
echo "💎 Adding allocations to genesis.json..."

# Read the base genesis info
BASE_GENESIS=$(cat "$TEMP_OUT/genesis.json")

# Extract addresses for allocation
ADDR1=$(cat "$DATA_DIR/node1/address")
ADDR2=$(cat "$DATA_DIR/node2/address")
ADDR3=$(cat "$DATA_DIR/node3/address")
ADDR4=$(cat "$DATA_DIR/node4/address")
DEV_ADDR="0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"

# Combine into final genesis
# 0xad78ebc5ac6200000 = 200 ETH
jq --arg a1 "$ADDR1" --arg a2 "$ADDR2" --arg a3 "$ADDR3" --arg a4 "$ADDR4" --arg dev "$DEV_ADDR" \
 '. + {
   "alloc": {
     $a1: { "balance": "0xad78ebc5ac6200000" },
     $a2: { "balance": "0xad78ebc5ac6200000" },
     $a3: { "balance": "0xad78ebc5ac6200000" },
     $a4: { "balance": "0xad78ebc5ac6200000" },
     $dev: { "balance": "0xad78ebc5ac6200000" }
   }
 }' "$TEMP_OUT/genesis.json" > "$GENESIS_FILE"

# 4. Clean up
sudo chown -R $USER:$USER "$DATA_DIR"
sudo rm -rf "$TEMP_OUT"
sudo rm -rf "$(pwd)/network/genesis/temp"

echo "🚀 Foundation Complete!"
echo "Genesis: $GENESIS_FILE"
echo "Nodes: node1, node2, node3, node4 initialized in $DATA_DIR"
