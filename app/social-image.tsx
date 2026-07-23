import { ImageResponse } from "next/og";

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #f7efe0 0%, #dce7e1 55%, #b9d2d9 100%)",
          color: "#22302e",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "72px 76px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(39, 126, 143, 0.14)",
            borderRadius: 999,
            height: 420,
            left: -150,
            position: "absolute",
            top: -190,
            width: 420,
          }}
        />
        <div
          style={{
            background: "rgba(183, 139, 59, 0.16)",
            borderRadius: 999,
            bottom: -210,
            height: 460,
            position: "absolute",
            right: 120,
            width: 460,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: 710,
          }}
        >
          <div
            style={{
              color: "#d25b36",
              display: "flex",
              fontSize: 25,
              fontWeight: 800,
              letterSpacing: 5,
              marginBottom: 24,
              textTransform: "uppercase",
            }}
          >
            Local-first hiking gear planner
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: -4,
              lineHeight: 0.98,
            }}
          >
            See the weight of every choice.
          </div>
          <div
            style={{
              color: "#495a55",
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              marginTop: 28,
            }}
          >
            Build your pack, compare categories, and keep the list private in your browser.
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            background: "rgba(255, 250, 240, 0.88)",
            border: "2px solid rgba(34, 48, 46, 0.16)",
            borderRadius: 38,
            boxShadow: "0 28px 70px rgba(34, 48, 46, 0.16)",
            display: "flex",
            flexDirection: "column",
            height: 410,
            justifyContent: "center",
            position: "relative",
            width: 310,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#2e5d44",
              borderRadius: 999,
              color: "#fffaf0",
              display: "flex",
              fontSize: 60,
              fontWeight: 900,
              height: 150,
              justifyContent: "center",
              width: 150,
            }}
          >
            2.4
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 900, marginTop: 28 }}>
            kg carried
          </div>
          <div style={{ color: "#66736d", display: "flex", fontSize: 23, marginTop: 8 }}>
            Your kit, visualized
          </div>
          <div
            style={{
              color: "#2e5d44",
              display: "flex",
              fontSize: 28,
              fontWeight: 900,
              marginTop: 32,
            }}
          >
            KitWeight
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
