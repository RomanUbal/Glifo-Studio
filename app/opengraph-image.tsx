import { ImageResponse } from "next/og"

export const alt = "Glifo Studio — Editor visual de diseño web"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 78% 18%, #7c2d12 0%, transparent 34%), linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          color: "#fafafa",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "52px",
          }}
        >
          <div
            style={{
              width: "172px",
              height: "172px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "42px",
              background: "#f97316",
              boxShadow: "0 28px 80px rgba(249, 115, 22, 0.35)",
              fontSize: "112px",
              fontWeight: 800,
            }}
          >
            G
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ color: "#fb923c", fontSize: "28px", fontWeight: 700 }}>
              EDITOR VISUAL DE DISEÑO WEB
            </div>
            <div style={{ fontSize: "82px", fontWeight: 800, letterSpacing: "-4px" }}>
              Glifo Studio
            </div>
            <div style={{ color: "#d4d4d8", fontSize: "32px" }}>
              Diseña · Prototipa · Exporta
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
