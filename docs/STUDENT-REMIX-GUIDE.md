# 🎓 Student Guide: Deploying to Imperial Virtual Lab with MetaMask & Remix

This guide explains how to connect **MetaMask** and **Remix IDE** to the private Besu network using your **Secure Discovery URL**.

---

## 🛡️ The "Iron Shield" Architecture
For security, the blockchain nodes are hidden. You cannot connect to them directly. All traffic must pass through the **Imperial Gateway**, which verifies your student identity (MSSV) before allowing any code to be deployed.

---

## 1. Get Your Connection Parameters
1. Open the [Student Portal](http://localhost:3001).
2. Login with your **MSSV** (Student ID).
3. Look for the **"Identity Discovery"** section.
4. Copy your **SECURE_RPC URL**. It will look like this:
   `http://localhost:5000/api/rpc/YOUR_MSSV`
5. Copy your **Private Key** (Keep this secret!).

---

## 2. Configure MetaMask
MetaMask is the bridge between your browser and the blockchain.

### A. Add the Imperial Network
1. Open **MetaMask** and click the Network selector (top left).
2. Click **"Add network"** -> **"Add a network manually"**.
3. Fill in the details:
   - **Network name**: `Imperial Virtual Lab`
   - **New RPC URL**: `[PASTE YOUR SECURE_RPC URL]`
   - **Chain ID**: `1337`
   - **Currency symbol**: `ETH`
4. Click **Save** and **Switch to Imperial Virtual Lab**.

### B. Import Your Student Wallet
1. In MetaMask, click the **Account Circle** (top right).
2. Click **"Import account"**.
3. Paste your **Private Key** from the portal.
4. Click **Import**.
5. You should now see your address with a balance (e.g., `200.0 ETH`). 

---

## ⚠️ 3. CRITICAL: Clear Activity After Network Reset
If your teacher resets the lab network, your MetaMask will get "out of sync" and your transactions will stay **Pending** forever. **Do this every time a new lab starts:**
1. Open **MetaMask** -> **Settings** -> **Advanced**.
2. Scroll down and click **"Clear activity tab data"** (or "Reset Account").
3. This resets your transaction counter (nonce) so you can talk to the fresh blockchain.

---

## 4. Connect Remix IDE
1. Open [Remix IDE](https://remix.ethereum.org/).
2. Create a new file (e.g., `Lab1.sol`).
3. In the left sidebar, click the **"Deploy & Run Transactions"** icon.
4. Change the **Environment** dropdown to **"Injected Provider - MetaMask"**.
5. MetaMask will pop up; select your student account and click **Connect**.

---

## 5. Deploy & Compile Settings
1. **Solidity Compiler**: Use version `0.8.20` or higher. (Recommended pragma: `pragma solidity >=0.8.2 <0.9.0;`).
2. **EVM Version**: The Imperial Lab supports the **Cancun** fork. You can leave the EVM version as `default`.
3. **Deploy**: Ensure your student account (with balance) is selected, then click **Deploy**.

---

## 🔎 Troubleshooting

### ❌ Error: "Forbidden" or "Access Denied"
**Cause**: Your student ID is currently "Blocked" or your MSSV in the RPC URL is wrong.
**Fix**: Ensure your MetaMask RPC URL ends with your correct MSSV. If it's correct, ask your instructor to **Whitelist** your address.

### ❌ Stuck on "Creation of ... pending"
**Cause**: Transaction Nonce Mismatch.
**Fix**: Follow **Section 3** above to Clear Activity Tab Data in MetaMask.

### ❌ Error: "Invalid Opcode"
**Cause**: Using a Solidity version too new for the network.
**Fix**: In Remix Compiler tab, change **EVM VERSION** to `shanghai` or `london` and re-compile.

---

## 📊 View Your Deployment
Once deployed, copy your **Transaction Hash** and paste it into the [Lab Explorer](http://localhost:4000) to see your code permanently recorded on the Imperial ledger.
