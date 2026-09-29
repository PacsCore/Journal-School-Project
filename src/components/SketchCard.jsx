import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function SketchCard({ entry }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [150 * entry.depth, -150 * entry.depth]);

  return (
    <motion.figure ref={ref} style={{ y, width: "min(420px, 80vw)" }}>
      <img src={entry.img} alt={entry.title} />
      <figcaption style={{ fontFamily: "var(--mono)", fontSize: 12, marginTop: 8 }}>
        {entry.title} · {entry.place}
      </figcaption>
    </motion.figure>
  );
}