import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Hero from "./components/Hero";
import DaySection from "./components/DaySection";
import { days } from "./data/entries";
import Nav from "./components/Nav";
import SketchTable from "./components/SketchTable";
import Museum from "./components/Museum";
import Timeline from "./components/Timeline";
import { museums } from "./data/museum";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ anchors: true });
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  return (
    <main id="top">
      <Nav />
      <header className="masthead">© 2026 - Enrique Achacoso</header>
      <Hero />
      <Timeline />
      <SketchTable />
      <div id="museen">
        {museums.map((museum) => <Museum key={museum.id} museum={museum} />)}
      </div>
      <div id="tage">
        {days.map((day) => <DaySection key={day.date} day={day} />)}
      </div>
    </main>
  );
}