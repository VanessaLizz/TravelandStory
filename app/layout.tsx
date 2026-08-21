import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Atlas Social de Viagens",
  description:
    "Um atlas pessoal e social para registrar viagens, organizar desejos e descobrir lugares por meio da comunidade.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Atlas Social de Viagens",
    description: "Seu mundo, cidade por cidade.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Atlas Social de Viagens — seu mundo, cidade por cidade.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Social de Viagens",
    description: "Seu mundo, cidade por cidade.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
