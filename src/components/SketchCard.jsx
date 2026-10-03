import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export default function SketchCard({ entry, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [120 * entry.depth, -120 * entry.depth]);
  const flip = index % 2 === 1;

  return (
    <div ref={ref} className={`sketch-row ${flip ? "flip" : ""}`}>
      <motion.figure className="sketch-figure" style={{ y }}>
        {/* Schweben: endlose sanfte Auf-und-ab-Bewegung */}
        <motion.div
          className="sketch-float"
          animate={{ y: [0, -14, 0], rotate: flip ? [1, -0.5, 1] : [-1, 0.5, -1] }}
          transition={{ duration: 6 + entry.depth * 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Aufdecken von unten nach oben */}
          <motion.img
            src={entry.img}
            alt={entry.title}
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.2, ease }}
            whileHover={{ scale: 1.03 }}
          />
        </motion.div>
        <figcaption>{entry.title} · {entry.place}</figcaption>
      </motion.figure>

      <motion.div
        className="sketch-text"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
      >
        <span className="sketch-meta">{entry.place}</span>
        <h3>{entry.title}</h3>
        <p>{entry.text}</p>
      </motion.div>
    </div>
  );
}