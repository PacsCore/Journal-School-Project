import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Hero from "./components/Hero";
import DaySection from "./components/DaySection";
import { days } from "./data/entries";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis();
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  return (
    <main>
      <Hero />
      {days.map((day) => <DaySection key={day.date} day={day} />)}
    </main>
  );
}