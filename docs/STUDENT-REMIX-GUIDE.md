# 🎓 Student Guide: Deploying to Imperial Virtual Lab with Remix

This guide explains how to connect **Remix IDE** to the private Besu network using your **Secure Discovery URL**.

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

## 2. Configure Remix IDE
1. Open the [Remix Website](https://remix.ethereum.org/).
2. In the left sidebar, click the **"Deploy & Run Transactions"** icon (the Ethereum logo).
3. Change the **Environment** dropdown from "Remix VM" to **"External HTTP Provider"**.
4. A popup will appear. Paste your **SECURE_RPC URL** into the box.
5. Click **OK**.
    * *Note: If you see a connection error, ensure your student status is set to "**Authorized**" in the Instructor Dashboard.*

---

## 3. Import Your Student Wallet
Remix does not know your keys by default. You must import them:
1. Under the **Account** section in Remix, click the **plus (+)** icon.
2. Paste your **Private Key**.
3. Click **Import**.
4. You should now see your address with a balance (e.g., `101.0 ETH`). **Eth equals Gas** in this lab—it has no real value.

---

## 4. Deploy Your First Contract
1. Go to the **File Explorer** (top left) and create a new file named `LabExperiment.sol`.
2. Paste your Solidity code and **Compile** it (middle icon in sidebar).
3. Go back to the **Deploy & Run** tab.
4. Select your student account from the list.
5. Click the orange **Deploy** button.

---

## 🔎 Troubleshooting

### ❌ Error: "Forbidden" or "Access Denied"
**Cause**: Your student ID is currently "Blocked" in the firewall.
**Fix**: Contact your instructor to whitelist your account in the `AccountAllowlist` contract.

### ❌ Error: "Could not connect to the endpoint"
**Cause**: Browser "Mixed Content" security settings.
**Fix**: Look at your browser address bar (right side) for a shield icon. Click it and select **"Allow Insecure Content"** or **"Load Unsafe Scripts"**. This allows the HTTPS Remix site to talk to your local Lab API.

---

## 📊 View Your Deployment
Once deployed, copy your **Transaction Hash** from the Remix console and paste it into the [Lab Explorer](http://localhost:4000) to see your code permanently recorded on the Imperial ledger.
