import type {
  Metadata,
} from "next";

import "./globals.css";
import "./travel-home.css";
import "./travel-profile.css";
import "./profile-map-refresh.css";
import "./fullscreen-layout.css";
import "./explore-v2.css";

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const metadata: Metadata =
  {
    metadataBase:
      new URL(siteUrl),

    title:
      "Atlas Social de Viagens",

    description:
      "Um atlas pessoal e social para registrar viagens, organizar desejos e descobrir lugares por meio da comunidade.",

    icons: {
      icon:
        "/favicon.svg",

      shortcut:
        "/favicon.svg",
    },

    openGraph: {
      title:
        "Atlas Social de Viagens",

      description:
        "Seu mundo, cidade por cidade.",

      type:
        "website",

      locale:
        "pt_BR",

      images: [
        {
          url:
            "/og.png",

          width:
            1731,

          height:
            909,

          alt:
            "Atlas Social de Viagens — seu mundo, cidade por cidade.",
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        "Atlas Social de Viagens",

      description:
        "Seu mundo, cidade por cidade.",

      images: [
        "/og.png",
      ],
    },
  };

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          href="/maplibre/maplibre-gl.css"
          rel="stylesheet"
        />
      </head>

      <body>
        {children}
      </body>
    </html>
  );
}