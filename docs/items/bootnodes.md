# Bootnodes and Peer Discovery

Bootnodes are the entry points for nodes to join the Besu network.

## The Role of Bootnodes
Bootnodes are used to discover other nodes in the network. When a new node starts, it connects to a bootnode to obtain a list of active peers.

## Configuration

### 1. Enode URL
A bootnode is identified by its **Enode URL**, which follows this format:
`enode://<NodePublicKey>@<IPAddress>:<ListeningPort>`

### 2. Static Nodes vs. Discovery
- **Discovery (P2P)**: Nodes find each other via bootnodes.
- **Static Nodes**: You can bypass discovery by providing a `static-nodes.json` file containing a list of enodes the node should always connect to.

### 3. Implementation in `ibn-besu-private`
- For our MVP, we should designate at least two nodes as bootnodes to ensure high availability for discovery.
- The bootnodes' Enode URLs must be shared with all other nodes via the `--bootnodes` flag or configuration file.

## Troubleshooting
- If nodes cannot find each other, check if the `NodePublicKey` in the enode URL matches the actual key of the bootnode.
- Ensure ports (default `30303`) are open between all node instances.
