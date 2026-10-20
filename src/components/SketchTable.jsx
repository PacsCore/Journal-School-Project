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

      <motion.div
        ref={tableRef}
        className="table"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.15 }}
      >
        {cards.map((c, i) => (
          <motion.figure
            key={c.src}
            className="table-card"
            drag
            dragConstraints={tableRef}
            dragElastic={0.15}
            onPointerDown={(ev) => (ev.currentTarget.style.zIndex = ++zRef.current)}
            whileDrag={{ scale: 1.06 }}
            variants={{
              hidden: { y: -180, opacity: 0, scale: 1.15 },
              shown: {
                y: 0,
                opacity: 1,
                scale: 1,
                transition: { type: "spring", stiffness: 260, damping: 18, delay: i * 0.08 },
              },
            }}
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              rotate: c.rotate,
              width: `min(${c.width}px, 38vw)`,
            }}
          >
            <img src={c.src} alt="" draggable={false} />
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
