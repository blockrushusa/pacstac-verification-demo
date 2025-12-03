# PacStac Verification Demo

Next.js (App Router) sample that proves PacStac (STAC) ownership: connect a wallet with RainbowKit, sign a short message, and read the STAC ERC-20 balance on Arbitrum Sepolia using viem. The site exports to static HTML and is served under the `/pacstac-verification-demo` base path.

## Quick start
- Prereqs: Node.js 18+ and npm (or pnpm/yarn).
- Install dependencies:
```bash
npm install
```
- Add `.env.local` (values can come from public RPCs for testing):
```ini
NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID=demo-rainbowkit-id   # WalletConnect Cloud id; demo fallback works
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL=<arbitrum_sepolia_rpc>
NEXT_PUBLIC_BASE_RPC_URL=<optional_base_mainnet_rpc>
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=<optional_base_sepolia_rpc>
NEXT_PUBLIC_PACSTAC_CONTRACT_ADDRESS=0xcC8fdca1077CFD74BFD674B3763BB9eA5DDFaDEf
NEXT_PUBLIC_PACSTAC_REQUIRED_AMOUNT=1
NEXT_PUBLIC_STAC_TOKEN_DECIMALS=18
```
The STAC balance check always uses Arbitrum Sepolia; Base/Base Sepolia are enabled only for wallet connection convenience. RPC URLs default to the public endpoints when env vars are omitted.

- Run locally:
```bash
npm run dev
```
Open `http://localhost:3000/pacstac-verification-demo/` for the landing page and `http://localhost:3000/pacstac-verification-demo/pacstac-verification-demo/` for the verifier. Adjust `basePath`/`assetPrefix` in `next.config.mjs` if you deploy at a different subpath or the site root.

## Build and deploy
```bash
npm run build
npx serve@latest out   # or host the out/ folder on any static host
```
`output: "export"`, `basePath`, `assetPrefix`, and `trailingSlash` are set so the static `out/` directory can be uploaded directly (GitHub Pages-style hosting). The `start` script is not used in this export flow.

## Verification flow
- Connect a wallet via RainbowKit (chains configured: Arbitrum Sepolia, Base, Base Sepolia).
- Enter a user id (defaults to `demo-user`), then sign `Verify PacStac ownership for user <userId> at <timestamp>`.
- Signatures older than 5 minutes or with a different format are rejected.
- `verifyPacStac` validates the signature with `verifyMessage`, reads the STAC balance from the configured contract on Arbitrum Sepolia via viem, and compares it to `NEXT_PUBLIC_PACSTAC_REQUIRED_AMOUNT` using `NEXT_PUBLIC_STAC_TOKEN_DECIMALS`.
- The UI returns the balance, threshold, and whether the wallet meets the requirement.

## Scripts
- `npm run dev` – start the Next.js dev server.
- `npm run lint` – run ESLint.
- `npm run build` – export the static site to `out/`.
