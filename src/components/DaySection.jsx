import SketchCard from "./SketchCard";

export default function DaySection({ day }) {
  return (
    <section className="day-section">
      <header className="day-section-head">
        <p className="day-section-date">{day.date}</p>
        <h2>{day.title}</h2>
        {day.diary && <p className="diary">{day.diary}</p>}
      </header>

      {day.entries.map((entry, i) => (
        <SketchCard key={entry.img} entry={entry} index={i} />
      ))}
    </section>
  );
}