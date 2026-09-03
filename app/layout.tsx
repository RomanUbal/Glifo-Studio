import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Glifo Studio",
  title: {
    default: "Glifo Studio — Editor visual de diseño web",
    template: "%s | Glifo Studio",
  },
  description:
    "Glifo Studio es un editor visual moderno para crear, prototipar y exportar sitios web sin escribir código.",
  authors: [{ name: "Román Ubal" }],
  creator: "Román Ubal",
  keywords: ["editor visual", "diseño web", "prototipado", "HTML", "no-code"],
  openGraph: {
    title: "Glifo Studio — Editor visual de diseño web",
    description:
      "Diseña con arrastrar y soltar, prueba vistas responsive y exporta HTML autónomo.",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glifo Studio — Editor visual de diseño web",
    description:
      "Diseña con arrastrar y soltar, prueba vistas responsive y exporta HTML autónomo.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={_geist.className}>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
