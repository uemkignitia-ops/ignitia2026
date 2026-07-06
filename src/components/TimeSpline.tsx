import Spline from "@splinetool/react-spline";
import Timer from "@/components/Timer";

export default function TimeSpline() {
  return (
    <div
      className="time-spline-wrap hidden md:block"
      style={{
        position: "absolute",
        right: "2.5%",
        top: "35%",
        transform: "translateY(-50%)",
        width: "520px",
        height: "430px",
        zIndex: 25,
        pointerEvents: "none",
      }}
    >
      {/* Spline background holder */}
      <Spline
        scene="https://prod.spline.design/XO4J3yWZAvi8k8vp/scene.splinecode"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      {/* Cyberpunk timer overlay */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "104%",
          transform: "translate(-50%, -50%)",
          width: "92%",
          zIndex: 2,
          pointerEvents: "auto",
        }}
      >
        <Timer embedded targetDate="2026-09-15T09:00:00" />
      </div>
    </div>
  );
}