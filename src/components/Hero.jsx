import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const COLORS = ["#1d4e9e", "#2aa6a0", "#d99a2b", "#6b8e3a", "#c4532c", "#f7f4ec", "#e8c547"];
const COLS = 14;
const ROWS = 8;
const rand = (a, b) => a + Math.random() * (b - a);

function makeTiles() {
  const tiles = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      tiles.push({
        id: `${r}-${c}`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        clip: `polygon(${rand(0, 15)}% ${rand(0, 15)}%, ${rand(85, 100)}% ${rand(0, 15)}%, ${rand(85, 100)}% ${rand(85, 100)}%, ${rand(0, 15)}% ${rand(85, 100)}%)`,
        dx: (c - COLS / 2) * rand(40, 90),
        dy: (r - ROWS / 2) * rand(40, 90),
        rot: rand(-90, 90),
        delay: (Math.abs(c - COLS / 2) + Math.abs(r - ROWS / 2)) * 0.04,
      });
    }
  }
  return tiles;
}

function Tile({ t, progress }) {
  const x = useTransform(progress, [0, 1], [0, t.dx]);
  const y = useTransform(progress, [0, 1], [0, t.dy]);
  const rotate = useTransform(progress, [0, 1], [0, t.rot]);
  const opacity = useTransform(progress, [0, 0.8], [1, 0]);

  return (
    <motion.div style={{ x, y, rotate, opacity }}>
      <motion.div
        className="tile"
        style={{ background: t.color, clipPath: t.clip }}
        initial={{ scale: 0, rotate: t.rot }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: t.delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

const word = "Barcelona";
const accents = { 1: "var(--red)", 4: "var(--blue)", 7: "#d99a2b" };

export default function Hero() {
  const ref = useRef(null);
  const tiles = useMemo(makeTiles, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section ref={ref} className="hero">
      <div className="mosaic">
        {tiles.map((t) => <Tile key={t.id} t={t} progress={scrollYProgress} />)}
      </div>

      <motion.div
        className="hero-blob"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="hero-title">
          {word.split("").map((char, i) => (
            <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
              <motion.span
                style={{ display: "inline-block", color: accents[i] }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.8 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                {char}
              </motion.span>
            </span>
          ))}
        </h1>
        <p className="hero-sub">20.–27.09.2026 · Kunst-Tagebuch</p>
      </motion.div>
    </section>
  );
}