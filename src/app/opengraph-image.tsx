import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/**
 * Image affichee quand un lien du site est partage sur les reseaux.
 *
 * Elle compte doublement ici : tout le trafic est cense venir de LinkedIn, X,
 * Instagram, YouTube et TikTok, et un lien sans visuel passe inapercu dans un
 * fil. Elle est generee au build, donc sans cout a l'execution.
 */
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Escalier de carres de la charte, decrit en coordonnees de grille. */
const PIXELS = [
  [0, 0],
  [1, 1],
  [2, 1],
  [2, 2],
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#191919",
          color: "#f1f1f2",
          padding: 72,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, right: 0 }}>
          {PIXELS.map(([col, row]) => (
            <div
              key={`${col}-${row}`}
              style={{
                position: "absolute",
                top: row * 64,
                right: col * 64,
                width: 64,
                height: 64,
                background: "#dc7917",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30 }}>
          <div style={{ width: 20, height: 20, background: "#dc7917" }} />
          <div style={{ fontWeight: 700, letterSpacing: -0.5 }}>flow_lab</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2.5,
              maxWidth: 940,
            }}
          >
            {site.tagline}
          </div>
          <div style={{ fontSize: 30, color: "#9a9a9f", maxWidth: 820 }}>
            Formations, workflows n8n prets a l&apos;emploi et conseil en automatisation.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            color: "#9a9a9f",
          }}
        >
          <div style={{ background: "#dc7917", color: "#ffffff", padding: "8px 18px" }}>
            Ressources gratuites
          </div>
          <div>flow-lab.vercel.app</div>
        </div>
      </div>
    ),
    size
  );
}
