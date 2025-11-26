import Link from "next/link";

export default function HomePage() {
  return (
    <main className="content">
      <div className="card">
        <span className="pill">PacStac · demo</span>
        <h1 className="headline">Token ownership verification</h1>
        <p className="subhead">
          Connect a wallet, sign a one-time message, and confirm you hold the
          PacStac (STAC) token on Arbitrum Sepolia. This sample pairs wagmi,
          RainbowKit, and viem to mirror the production flow.
        </p>
        <div className="hero-actions">
          <Link href="/pacstac-verification-demo" className="cta">
            Try the verifier
          </Link>
          <Link href="https://www.rainbowkit.com/" className="nav-link">
            RainbowKit docs
          </Link>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Flow at a glance</h3>
        <ol className="list">
          <li>Connect wallet via RainbowKit</li>
          <li>Sign the PacStac verification message</li>
          <li>Backend reads STAC balance on Arbitrum Sepolia via viem</li>
          <li>Response indicates whether the wallet meets the threshold</li>
        </ol>
      </div>
    </main>
  );
}
