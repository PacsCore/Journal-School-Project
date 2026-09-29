import SketchCard from "./SketchCard";

export default function DaySection({ day }) {
  return (
    <section style={{ minHeight: "100vh", padding: "10vh 8vw" }}>
      <p style={{ fontFamily: "var(--mono)", color: "var(--blue)" }}>{day.date}</p>
      <h2 style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 400, marginBottom: "8vh" }}>
        {day.title}
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6vw", alignItems: "flex-start" }}>
        {day.entries.map((entry) => (
          <SketchCard key={entry.title} entry={entry} />
        ))}
      </div>
    </section>
  );
}