"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { verifyPacStac, VerifyResponse } from "@/lib/verification";
import type { Address } from "viem";

const DEFAULT_USER_ID = "demo-user";

export default function PacStacVerificationPage() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();

  const [userId, setUserId] = useState(DEFAULT_USER_ID);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [latestTimestamp, setLatestTimestamp] = useState<string | null>(null);

  useEffect(() => {
    // Populate a real timestamp for the preview as soon as the component is ready.
    setLatestTimestamp(Date.now().toString());
  }, [userId]);

  const handleVerify = async () => {
    if (!isConnected || !address) {
      setError("Connect a wallet first.");
      return;
    }

    const timestamp = Date.now();
    setLatestTimestamp(timestamp.toString());
    const resolvedUserId = userId || DEFAULT_USER_ID;
    const message = `Verify PacStac ownership for user ${resolvedUserId} at ${timestamp}`;

    try {
      setIsVerifying(true);
      setStatus("Requesting signature...");
      setError(null);
      setResult(null);

      const signature = await signMessageAsync({ message });

      setStatus("Checking on-chain balance...");

      const verification = await verifyPacStac({
        address: address as Address,
        signature,
        message,
        timestamp,
        userId: resolvedUserId,
      });

      setResult(verification);
      setStatus(
        verification.verified
          ? "Wallet meets the PacStac threshold"
          : "Balance below threshold",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus(null);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="content">
      <div className="card">
        <h1 className="headline" style={{ marginBottom: 10 }}>
          Verify PacStac tokens
        </h1>
        <p className="subhead">
          Sign a one-time message from your wallet and the API will read your STAC balance
          on Arbitrum Sepolia. Replace the contract address and thresholds in the environment
          variables to point at your deployment.
        </p>
        <div className="hero-actions">
          <ConnectButton />
          {address && (
            <span className="pill">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          )}
        </div>
      </div>

      <div className="panel-grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>1) Sign &amp; send</h3>
          <label className="label" htmlFor="user-id">
            User ID to bind
          </label>
          <input
            id="user-id"
            className="input"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="app user id (uid)"
          />
          <p className="muted">
            Message format: <code>Verify PacStac ownership for user {'<userId>'} at {'<timestamp>'}</code>
          </p>
          <button
            type="button"
            className="button"
            onClick={handleVerify}
            disabled={isVerifying || isSigning}
          >
            {isVerifying || isSigning ? 'Working...' : 'Sign & Verify'}
          </button>

          {status && (
            <div className="status-row">
              <span className="pill success">Progress</span>
              <span className="muted">{status}</span>
            </div>
          )}

          {error && (
            <div className="status-row">
              <span className="pill error">Error</span>
              <span className="muted">{error}</span>
            </div>
          )}

          <div className="code-block">
            {`Verify PacStac ownership for user ${userId || DEFAULT_USER_ID} at ${latestTimestamp ?? "timestamp loading..."}`}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>2) Result</h3>
          {!result && !error && (
            <p className="muted">No verification yet. Connect a wallet and click “Sign & Verify”.</p>
          )}
          {result && (
            <>
              <div className="status-row" style={{ marginBottom: 12 }}>
                <span className={`pill ${result.verified ? 'success' : 'warn'}`}>
                  {result.verified ? 'Verified' : 'Not verified'}
                </span>
                <span className="muted">
                  {result.message ?? (result.verified ? 'Threshold met' : 'Balance below threshold')}
                </span>
              </div>

              <div className="data-grid">
                <div className="data-item">
                  <div className="small-label">Wallet</div>
                  <div>{result.pacstacAddress ?? address ?? '—'}</div>
                </div>
                <div className="data-item">
                  <div className="small-label">Balance (STAC)</div>
                  <div>{result.balance}</div>
                </div>
                <div className="data-item">
                  <div className="small-label">Required</div>
                  <div>{result.threshold}</div>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="status-row" style={{ marginTop: 12 }}>
              <span className="pill error">API</span>
              <span className="muted">{error}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
