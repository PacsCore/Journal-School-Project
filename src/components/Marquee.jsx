import { motion } from "framer-motion";

const items = ["Picasso", "Tàpies", "Barceloneta", "Gaudí", "MEAM", "Miró", "La Boqueria"];

export default function Marquee() {
  const row = [...items, ...items]; // doppelt, damit es nahtlos loopt

  return (
    <div style={{ overflow: "hidden", borderBlock: "1px solid var(--ink)", padding: "1.2rem 0" }}>
      <motion.div
        style={{ display: "flex", gap: "3rem", width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      >
        {row.map((item, i) => (
          <span key={i} style={{ fontSize: "clamp(2rem, 5vw, 4rem)", whiteSpace: "nowrap" }}>
            {item} <span style={{ color: "var(--red)" }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}