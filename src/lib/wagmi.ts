import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { arbitrumSepolia, base, baseSepolia, type Chain } from "wagmi/chains";

const ARBITRUM_SEPOLIA_RPC_URL =
  (process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL ?? "").trim() ||
  arbitrumSepolia.rpcUrls.default.http[0];

const BASE_RPC_URL =
  (process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "").trim() || base.rpcUrls.default.http[0];

const BASE_SEPOLIA_RPC_URL =
  (process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ?? "").trim() ||
  baseSepolia.rpcUrls.default.http[0];

export const chains: [Chain, ...Chain[]] = [arbitrumSepolia, base, baseSepolia];

export const wagmiConfig = getDefaultConfig({
  appName: "PacStac Verification Demo",
  projectId: process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID ?? "demo-rainbowkit-id",
  chains,
  ssr: true,
  transports: {
    [arbitrumSepolia.id]: http(ARBITRUM_SEPOLIA_RPC_URL),
    [base.id]: http(BASE_RPC_URL),
    [baseSepolia.id]: http(BASE_SEPOLIA_RPC_URL),
  },
});
