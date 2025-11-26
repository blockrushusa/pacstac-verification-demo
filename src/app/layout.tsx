import type { Metadata } from "next";
import Link from "next/link";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "PacStac Verification Demo",
  description:
    "Example React/Next app that verifies PacStac (STAC) token ownership with RainbowKit, wagmi, and viem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-shell">
            <header className="app-bar">
              <div className="logo">PACSTAC VERIFICATION DEMO</div>
              <nav className="nav-links">
                <Link className="nav-link" href="/">
                  Home
                </Link>
                <Link className="nav-link" href="/pacstac-verification-demo">
                  Verify
                </Link>
              </nav>
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
