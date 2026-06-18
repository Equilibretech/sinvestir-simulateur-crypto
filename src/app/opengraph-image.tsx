import { ImageResponse } from "next/og";
import { MARK_DATA_URI } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Simulateur Crypto · S'investir";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "radial-gradient(900px 500px at 80% -10%, #0049c6 0%, transparent 55%), #080c16",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK_DATA_URI} width={96} height={96} alt="" />
          <div style={{ fontSize: 30, color: "#9ca3af", display: "flex" }}>
            S&apos;investir · Simulateurs
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          Simulateur d&apos;investissement crypto
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#9ca3af",
            display: "flex",
          }}
        >
          Apport unique ou DCA · données historiques · analyse IA
        </div>
      </div>
    ),
    { ...size },
  );
}
