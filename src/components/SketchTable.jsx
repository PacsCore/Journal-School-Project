import { useMemo, useRef } from "react";
import { motion } from "framer-motion";

// Alle Bilder aus src/assets/tisch, alphabetisch sortiert
const images = Object.entries(
  import.meta.glob("../assets/tisch/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}", { eager: true, import: "default" })
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const rand = (min, max) => min + Math.random() * (max - min);

export default function SketchTable() {
  const tableRef = useRef(null);
  const zRef = useRef(1);

  // Grobes Raster + Zufall, nur einmal berechnet
  const cards = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(images.length * 1.5));
    const rows = Math.ceil(images.length / cols);
    const order = images.map((_, i) => i).sort(() => Math.random() - 0.5); // Bilder zufällig auf Zellen verteilen
    return images.map((src, i) => {
      const cell = order[i];
      const col = cell % cols;
      const row = Math.floor(cell / cols);
      return {
        src,
        left: (col / cols) * 88 + rand(0, 88 / cols - 6),
        top: (row / rows) * 82 + rand(0, 82 / rows - 4),
        rotate: rand(-8, 8),
        width: Math.round(rand(150, 240)),
      };
    });
  }, []);

  return (
    <section id="tisch" style={{ padding: "10vh 4vw" }}>
      <p style={{ fontFamily: "var(--mono)", color: "var(--blue)" }}>Zieh die Bilder herum</p>
      <h2 style={{ fontFamily: "var(--display)", fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 400, marginBottom: "4vh" }}>
        WAS WIR GEMACHT HABEN
      </h2>

      <div ref={tableRef} className="table">
        {cards.map((c, i) => (
          // Außen: nur Ziehen
          <motion.div
            key={c.src}
            className="table-drag"
            drag
            dragConstraints={tableRef}
            dragElastic={0.1}
            dragMomentum={false}
            onPointerDown={(ev) => (ev.currentTarget.style.zIndex = ++zRef.current)}
            style={{ left: `${c.left}%`, top: `${c.top}%`, width: `min(${c.width}px, 38vw)`, zIndex: 1 }}
          >
            {/* Innen: nur Optik */}
            <motion.figure
              className="table-card"
              initial={{ opacity: 0, y: -60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: (i % 8) * 0.06 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1.05 }}
              style={{ rotate: c.rotate }}
            >
              <img src={c.src} alt="" draggable={false} />
            </motion.figure>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
