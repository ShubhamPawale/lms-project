import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS",
  description: "Minimalist learning management system"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <div className="topbar-left">
              <div className="brand-mark">L</div>
              <div className="brand-text">
                <div className="brand-title">Learning Studio</div>
                <div className="brand-subtitle">Structured video courses</div>
              </div>
            </div>
            <nav className="topbar-nav">
              <a href="/subjects" className="topbar-link">
                Subjects
              </a>
              <a href="/profile" className="topbar-link">
                Profile
              </a>
            </nav>
          </header>
          <main className="shell-main">{children}</main>
        </div>
      </body>
    </html>
  );
}

