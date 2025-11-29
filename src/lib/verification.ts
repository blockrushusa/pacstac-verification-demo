import {
  Address,
  Hex,
  createPublicClient,
  formatUnits,
  getAddress,
  http,
  parseAbi,
  verifyMessage,
} from "viem";
import { arbitrumSepolia } from "viem/chains";

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
]);

const MESSAGE_MAX_AGE_MS = 5 * 60 * 1000;
const DEFAULT_CONTRACT_ADDRESS: Address = "0xcC8fdca1077CFD74BFD674B3763BB9eA5DDFaDEf";

const pacstacContractAddress: Address = (() => {
  const configuredAddress = process.env.NEXT_PUBLIC_PACSTAC_CONTRACT_ADDRESS?.trim();
  if (!configuredAddress) {
    return DEFAULT_CONTRACT_ADDRESS;
  }

  try {
    return getAddress(configuredAddress);
  } catch {
    return DEFAULT_CONTRACT_ADDRESS;
  }
})();

const rpcUrl =
  (process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL ?? "").trim() ||
  arbitrumSepolia.rpcUrls.default.http[0];

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(rpcUrl),
});

const getThreshold = () => {
  const thresholdEnv = process.env.NEXT_PUBLIC_PACSTAC_REQUIRED_AMOUNT;
  const parsedThreshold = Number.parseFloat(thresholdEnv ?? "");
  return Number.isFinite(parsedThreshold) && parsedThreshold > 0 ? parsedThreshold : 1;
};

const getDecimals = () => {
  const decimalsEnv = process.env.NEXT_PUBLIC_STAC_TOKEN_DECIMALS;
  const parsedDecimals = Number(decimalsEnv ?? 18);
  return Number.isFinite(parsedDecimals) && parsedDecimals > 0 ? parsedDecimals : 18;
};

export type VerifyRequest = {
  address: Address;
  signature: Hex;
  message: string;
  timestamp: number;
  userId: string;
};

export type VerifyResponse = {
  verified: boolean;
  balance: string;
  threshold: string;
  pacstacAddress: string;
  message?: string;
};

export async function verifyPacStac({
  address,
  signature,
  message,
  timestamp,
  userId,
}: VerifyRequest): Promise<VerifyResponse> {
  if (!Number.isFinite(timestamp)) {
    throw new Error("Invalid timestamp.");
  }

  const messageAge = Math.abs(Date.now() - timestamp);
  if (messageAge > MESSAGE_MAX_AGE_MS) {
    throw new Error("Signed message is too old. Please try again.");
  }

  const expectedMessage = `Verify PacStac ownership for user ${userId} at ${timestamp}`;
  if (message !== expectedMessage) {
    throw new Error("Message format mismatch.");
  }

  const didVerify = await verifyMessage({
    address,
    message,
    signature,
  });

  if (!didVerify) {
    throw new Error("Signature verification failed.");
  }

  const balance = await publicClient.readContract({
    address: pacstacContractAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  const decimals = getDecimals();
  const threshold = getThreshold();

  const balanceFormatted = formatUnits(balance, decimals);
  const balanceValue = Number.parseFloat(balanceFormatted);
  const verified = Number.isFinite(balanceValue) && balanceValue >= threshold;

  return {
    verified,
    balance: balanceFormatted,
    threshold: threshold.toString(),
    pacstacAddress: address,
    message: verified
      ? "Balance meets required threshold."
      : "Balance below required threshold.",
  };
}
