import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const HEIGHTS = [0.42, 0.78, 1, 0.62, 0.3];

/** The noise mark on a carbon tile. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          background: "#111111",
          borderRadius: 40,
          paddingBottom: 40,
          gap: 10,
        }}
      >
        {HEIGHTS.map((v, i) => (
          <div key={i} style={{ width: 14, height: v * 100, background: "#F6F5F0", borderRadius: 4 }} />
        ))}
      </div>
    ),
    size,
  );
}
