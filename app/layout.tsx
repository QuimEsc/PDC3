import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laboratori PDC",
  description: "Àmbit científic de 3r ESO PDC · Comunitat Valenciana",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ca-valencia">
      <head>
        <Script src="/config.js" strategy="beforeInteractive" />
        <Script src="/firebase-config.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js" strategy="beforeInteractive" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
