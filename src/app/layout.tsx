import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://sdhporin.cz";
const SITE_NAME = "SDH Pořín";
const SITE_TITLE = "SDH Pořín – Sbor dobrovolných hasičů Pořín, Dolní Hořice";
const SITE_DESCRIPTION =
  "Sbor dobrovolných hasičů Pořín (SDH Pořín) – založen 1899. Práce s dětmi a mládeží od roku 2016, hasičské soutěže (Plamen), kulturní akce v obci Pořín u Dolních Hořic. Aktuality, kalendář akcí a kontakt.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | SDH Pořín",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  authors: [{ name: "SDH Pořín" }],
  creator: "SDH Pořín",
  publisher: "SDH Pořín",
  category: "community",
  keywords: [
    "SDH Pořín",
    "SDH",
    "Pořín",
    "hasiči Pořín",
    "dobrovolní hasiči Pořín",
    "sbor dobrovolných hasičů Pořín",
    "hasičský sbor Pořín",
    "Dolní Hořice hasiči",
    "hasiči Dolní Hořice",
    "Pořín obec",
    "plamen Pořín",
    "hasičské soutěže",
    "požární sport",
    "mladí hasiči Pořín",
    "kulturní akce Pořín",
    "masopust Pořín",
    "dětský karneval Pořín",
    "stavění máje Pořín",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "cs-CZ": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "SDH Pořín – logo Sboru dobrovolných hasičů Pořín",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/images/logo.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "google-site-verification=1DlbWugK_zI-9d7qHjVNIbmjxn3AT0axzV2ZRnbf62c", // doplnit po ověření v GSC
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dc2626" },
    { media: "(prefers-color-scheme: dark)", color: "#b91c1c" },
  ],
  colorScheme: "light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "EmergencyService", "NGO"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: [
    "Sbor dobrovolných hasičů Pořín",
    "Hasiči Pořín",
    "SDH Pořín",
  ],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/images/logo.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "1899",
  slogan: "Dobrovolný hasičský sbor – od roku 1899",
  email: "sdhporin@seznam.cz",
  telephone: "+420603372050",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Pořín 71",
    addressLocality: "Dolní Hořice",
    postalCode: "391 55",
    addressRegion: "Jihočeský kraj",
    addressCountry: "CZ",
  },
  areaServed: {
    "@type": "Place",
    name: "Pořín, Dolní Hořice a okolí",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+420603372050",
      email: "sdhporin@seznam.cz",
      contactType: "customer service",
      areaServed: "CZ",
      availableLanguage: ["Czech", "cs"],
    },
  ],
  knowsLanguage: ["cs"],
  member: [
    {
      "@type": "Person",
      name: "Radek Čekal",
      jobTitle: "Starosta sboru",
    },
  ],
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "cs-CZ",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  "@id": `${SITE_URL}/#place`,
  name: "Hasičská zbrojnice Pořín",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Pořín 71",
    addressLocality: "Dolní Hořice",
    postalCode: "391 55",
    addressCountry: "CZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={inter.variable}>
      <head>
        <link rel="canonical" href={SITE_URL} />
        <link
          rel="preload"
          as="image"
          href="/images/logo.png"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(placeSchema),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a
          href="#hlavni-obsah"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-red-700 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        >
          Přeskočit na obsah
        </a>
        {children}
      </body>
    </html>
  );
}
