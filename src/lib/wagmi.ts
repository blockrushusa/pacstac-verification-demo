import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { arbitrumSepolia, base, baseSepolia } from "wagmi/chains";

const ARBITRUM_SEPOLIA_RPC_URL =
  process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL ??
  process.env.ARBITRUM_SEPOLIA_RPC_URL ??
  arbitrumSepolia.rpcUrls.default.http[0];

const BASE_RPC_URL =
  process.env.NEXT_PUBLIC_BASE_RPC_URL ??
  process.env.BASE_RPC_URL ??
  base.rpcUrls.default.http[0];

const BASE_SEPOLIA_RPC_URL =
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ??
  process.env.BASE_SEPOLIA_RPC_URL ??
  baseSepolia.rpcUrls.default.http[0];

export const chains = [arbitrumSepolia, base, baseSepolia];

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
