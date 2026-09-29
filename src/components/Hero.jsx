export default function Hero() {
  return (
    <section
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "clamp(4rem, 15vw, 12rem)", fontWeight: 400 }}>
        Barcelona
      </h1>
      <p style={{ fontFamily: "var(--mono)", color: "var(--red)" }}>
        20.–27.09.2026 · Kunst-Tagebuch
      </p>
    </section>
  );
}