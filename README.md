# PacStac Verification Demo

Next.js + RainbowKit demo that signs a message and verifies STAC (PacStac) token balances on Arbitrum Sepolia. Includes Base/Base Sepolia support for wallet connections.

## Requirements
- Node.js 18+
- npm (or pnpm/yarn)
- RainbowKit Cloud project id for WalletConnect (or use the demo default)

## Setup
```bash
npm install
```

## Configuration
Create a `.env.local` for local development (values can come from public RPCs for testing):
```ini
NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID=<walletconnect_project_id_or_demo>
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL=<arbitrum_sepolia_rpc>
NEXT_PUBLIC_BASE_RPC_URL=<base_mainnet_rpc_optional>
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=<base_sepolia_rpc_optional>
NEXT_PUBLIC_PACSTAC_REQUIRED_AMOUNT=1
NEXT_PUBLIC_STAC_TOKEN_DECIMALS=18
# Optional: override the demo contract
NEXT_PUBLIC_PACSTAC_CONTRACT_ADDRESS=0xcC8fdca1077CFD74BFD674B3763BB9eA5DDFaDEf
```

Notes:
- The STAC contract for this demo defaults to `0xcC8fdca1077CFD74BFD674B3763BB9eA5DDFaDEf` (public Arbitrum Sepolia deployment). Override it with `NEXT_PUBLIC_PACSTAC_CONTRACT_ADDRESS` if needed.
- If you provide private RPC URLs, keep them in non-committed env files. All env vars used by the client must be prefixed with `NEXT_PUBLIC_` because the site is statically exported.

## Running
```bash
npm run dev
```
Open `http://localhost:3000` and click “Try the verifier” (route: `/pacstac-verification-demo`).

To create a static build (emits to `out/` because `output: "export"` is enabled):
```bash
npm run build
npx serve@latest out  # or host the out/ folder on any static host
```

## What it does
1) RainbowKit connects a wallet on Arbitrum Sepolia/Base/Base Sepolia.  
2) User signs a one-time message: `Verify PacStac ownership for user <userId> at <timestamp>`.  
3) Client verifies the signature and checks the STAC token balance via viem; response indicates if the balance meets `NEXT_PUBLIC_PACSTAC_REQUIRED_AMOUNT`.
