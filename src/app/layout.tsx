import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: {
    default: "SDH Pořín – Sbor dobrovolných hasičů",
    template: "%s | SDH Pořín",
  },
  description:
    "Sbor dobrovolných hasičů Pořín, založený v roce 1899. Události, akce, práce s mládeží a kontaktní informace. Obec Pořín, Dolní Hořice.",
  keywords: [
    "SDH Pořín",
    "SDH",
    "Pořín",
    "hasiči",
    "dobrovolní hasiči",
    "Dolní Hořice",
    "hasičský sbor",
    "sbor dobrovolných hasičů",
    "hasiči Pořín",
    "plamen",
    "hasičské soutěže",
    "požární sport",
  ],
  metadataBase: new URL("https://sdhporin.cz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SDH Pořín – Sbor dobrovolných hasičů",
    description:
      "Sbor dobrovolných hasičů Pořín, založený v roce 1899. Události, akce a práce s mládeží.",
    url: "https://sdhporin.cz",
    siteName: "SDH Pořín",
    type: "website",
    locale: "cs_CZ",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "SDH Pořín logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SDH Pořín",
              alternateName: "Sbor dobrovolných hasičů Pořín",
              url: "https://sdhporin.cz",
              logo: "https://sdhporin.cz/images/logo.png",
              foundingDate: "1899",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Pořín 71",
                addressLocality: "Dolní Hořice",
                postalCode: "391 55",
                addressCountry: "CZ",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+420603372050",
                email: "sdhporin@seznam.cz",
                contactType: "customer service",
                areaServed: "CZ",
                availableLanguage: "Czech",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
