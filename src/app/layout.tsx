import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://apidocai.com"),
  title: {
    default: "API Doc AI - Laravel API Documentation Generator",
    template: "%s | API Doc AI",
  },
  description:
    "Automatically turn your Laravel API into professional API documentation. Generate OpenAPI specs and Markdown docs with AI-powered analysis.",
  keywords: [
    "Laravel API documentation",
    "Laravel OpenAPI generator",
    "API documentation tool",
    "OpenAPI 3.1",
    "Laravel Swagger alternative",
    "automatic API docs",
  ],
  authors: [{ name: "API Doc AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apidocai.com",
    siteName: "API Doc AI",
    title: "API Doc AI - Turn Your Laravel API Into Beautiful Documentation",
    description:
      "Automatically analyze your Laravel project and generate professional API documentation with OpenAPI 3.1 and Markdown.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "API Doc AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "API Doc AI - Laravel API Documentation Generator",
    description:
      "Automatically turn your Laravel API into professional API documentation.",
    images: ["/og.png"],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://apidocai.com" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
