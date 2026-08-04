import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#070707",
          color: "#f3efe6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: -2 }}>
          MIGUEL GUERREIRO
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#8a8880",
            marginTop: 28,
            letterSpacing: 6,
          }}
        >
          SOFTWARE ENGINEER · FRONT-END DEVELOPER
        </div>
      </div>
    ),
    { ...size }
  );
}
