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

## 3. Connect Remix IDE
1. Open [Remix IDE](https://remix.ethereum.org/).
2. In the left sidebar, click the **"Deploy & Run Transactions"** icon (the Ethereum logo).
3. Change the **Environment** dropdown to **"Injected Provider - MetaMask"**.
4. MetaMask will pop up; select your student account and click **Connect**.
5. Your account address and balance should now be visible in Remix.

---

## 4. Deploy Your First Contract
1. Go to the **File Explorer** (top left) and create a new file named `LabExperiment.sol`.
2. Paste your Solidity code and **Compile** it (middle icon in sidebar).
3. Go back to the **Deploy & Run** tab.
4. Ensure your student account is selected.
5. Click **Deploy**. MetaMask will pop up for you to **Confirm** the transaction.

---

## 🔎 Troubleshooting

### ❌ Error: "Forbidden" or "Access Denied"
**Cause**: Your student ID is currently "Blocked" or your MSSV in the RPC URL doesn't match your identity.
**Fix**: Ensure your MetaMask RPC URL ends with your correct MSSV. If it's correct and still fails, contact your instructor to whitelist your account.

### ❌ Error: "Could not connect to the endpoint"
**Cause**: Browser security or the API server is down.
**Fix**: 
1. Check if the portal at `http://localhost:5000/api/health` shows "UP".
2. If using MetaMask, ensure no other VPN or Proxy is interfering with `localhost`.
3. In some browsers, you may need to click the shield icon in the address bar and select **"Allow Insecure Content"** to allow the HTTPS Remix site to talk to the local HTTP gateway.

---

## 📊 View Your Deployment
Once deployed, copy your **Transaction Hash** from the MetaMask "Activity" tab or the Remix console and paste it into the [Lab Explorer](http://localhost:4000) to see your code permanently recorded on the Imperial ledger.
