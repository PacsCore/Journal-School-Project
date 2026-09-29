import { useRef } from "react";
import { motion } from "framer-motion";
import { days } from "../data/entries";

const all = days.flatMap((d) => d.entries.map((e) => ({ ...e, date: d.date })));

export default function SketchTable() {
  const tableRef = useRef(null);
  const zRef = useRef(1);

  return (
    <section id="tisch" style={{ padding: "10vh 4vw" }}>
      <p style={{ fontFamily: "var(--mono)", color: "var(--blue)" }}>Zieh die Skizzen herum</p>
      <h2 style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 400, marginBottom: "4vh" }}>
        Der Tisch
      </h2>

      <div ref={tableRef} className="table">
        {all.map((e, i) => (
          <motion.figure
            key={e.img}
            className="table-card"
            drag
            dragConstraints={tableRef}
            dragElastic={0.15}
            onPointerDown={(ev) => (ev.currentTarget.style.zIndex = ++zRef.current)}
            whileDrag={{ scale: 1.06, rotate: 0 }}
            style={{
              left: `${10 + ((i * 23) % 60)}%`,
              top: `${8 + ((i * 31) % 50)}%`,
              rotate: (i % 2 ? 1 : -1) * (3 + (i % 4)),
            }}
          >
            <img src={e.img} alt={e.title} draggable={false} />
            <figcaption>{e.title} · {e.date}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}