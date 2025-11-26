import { NextRequest, NextResponse } from "next/server";
import {
  Address,
  createPublicClient,
  formatUnits,
  http,
  parseAbi,
  verifyMessage,
} from "viem";
import { arbitrumSepolia } from "viem/chains";

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
]);

const MESSAGE_MAX_AGE_MS = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, signature, message, timestamp, userId } = body ?? {};

    if (!address || !signature || !message || !timestamp || !userId) {
      return NextResponse.json(
        { error: "Missing address, signature, message, timestamp, or userId." },
        { status: 400 },
      );
    }

    const timestampMs = Number(timestamp);
    if (!Number.isFinite(timestampMs)) {
      return NextResponse.json({ error: "Invalid timestamp." }, { status: 400 });
    }

    const messageAge = Math.abs(Date.now() - timestampMs);
    if (messageAge > MESSAGE_MAX_AGE_MS) {
      return NextResponse.json(
        { error: "Signed message is too old. Please try again." },
        { status: 400 },
      );
    }

    const expectedMessage = `Verify PacStac ownership for user ${userId} at ${timestamp}`;
    if (message !== expectedMessage) {
      return NextResponse.json({ error: "Message format mismatch." }, { status: 400 });
    }

    const didVerify = await verifyMessage({
      address: address as Address,
      message,
      signature,
    });

    if (!didVerify) {
      return NextResponse.json({ error: "Signature verification failed." }, { status: 401 });
    }

    // Public PacStac demo contract on Arbitrum Sepolia (safe to hardcode for this sample).
    const contractAddress: Address = "0xcC8fdca1077CFD74BFD674B3763BB9eA5DDFaDEf";

    const rpcUrl =
      process.env.ARBITRUM_SEPOLIA_RPC_URL ||
      process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL;

    const client = createPublicClient({
      chain: arbitrumSepolia,
      transport: http(rpcUrl),
    });

    const balance = await client.readContract({
      address: contractAddress as Address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address as Address],
    });

    const decimals = Number(process.env.STAC_TOKEN_DECIMALS ?? 18);
    const thresholdEnv = process.env.PACSTAC_REQUIRED_AMOUNT;
    const parsedThreshold = Number.parseFloat(thresholdEnv ?? "");
    const threshold =
      Number.isFinite(parsedThreshold) && parsedThreshold > 0 ? parsedThreshold : 1;

    const balanceFormatted = formatUnits(balance, decimals);
    const balanceValue = Number.parseFloat(balanceFormatted);
    const verified = Number.isFinite(balanceValue) && balanceValue >= threshold;

    return NextResponse.json({
      verified,
      balance: balanceFormatted,
      threshold: threshold.toString(),
      pacstacAddress: address,
      message: verified
        ? "Balance meets required threshold."
        : "Balance below required threshold.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
