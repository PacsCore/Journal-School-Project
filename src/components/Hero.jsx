import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";
import { motion, useScroll, useTransform } from "framer-motion";

// Park-Güell-Palette
const PALETTE = {
  blue: ["#1f3f8f", "#2b5bb5", "#3a74c9", "#18306b"],
  turq: ["#2a9d9a", "#47b5b0", "#1f7f86"],
  ochre: ["#d99a2b", "#e8b64c", "#c9822a"],
  white: ["#f3efe4", "#e9e3d3", "#faf7ef"],
  green: ["#5f8a3a", "#7aa04a"],
  red: ["#b8432b", "#cf5a3a"],
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Farbe nach Position → wellige Bänder wie die Bank im Park Güell
function colorAt(x, y) {
  if (Math.random() < 0.06) return pick(Math.random() < 0.5 ? PALETTE.red : PALETTE.green);
  const v = Math.sin(x * 0.006 + Math.sin(y * 0.01) * 1.5) + 0.6 * Math.sin(y * 0.012 + x * 0.003);
  if (v < -0.8) return pick(PALETTE.blue);
  if (v < -0.25) return pick(PALETTE.white);
  if (v < 0.3) return pick(PALETTE.ochre);
  if (v < 0.85) return pick(PALETTE.turq);
  return pick(PALETTE.blue);
}

// Welliges Feld in der Mitte, das frei bleibt (für den Titel)
function inCartouche(x, y, w, h) {
  const cw = Math.min(w * (w < 700 ? 0.85 : 0.6), 900) / 2;
  const ch = Math.min(h * 0.38, 340) / 2;
  const wave = 16;
  return (
    Math.abs(x - w / 2) < cw + wave * Math.sin(y * 0.04) &&
    Math.abs(y - h / 2) < ch + wave * Math.sin(x * 0.03)
  );
}

function buildShards(ctx, w, h) {
  const count = Math.round((w * h) / 1300);
  const step = Math.sqrt((w * h) / count);

  // Punkte in einem leicht verwackelten Raster → gleichmäßig, aber unregelmäßig
  const pts = [];
  for (let y = 0; y < h + step; y += step) {
    for (let x = 0; x < w + step; x += step) {
      pts.push([x + (Math.random() - 0.5) * step * 0.9, y + (Math.random() - 0.5) * step * 0.9]);
    }
  }

  const voronoi = Delaunay.from(pts).voronoi([0, 0, w, h]);
  const shards = [];

  pts.forEach(([px, py], i) => {
    const poly = voronoi.cellPolygon(i);
    if (!poly || inCartouche(px, py, w, h)) return;

    const r = step * 0.6;
    const glaze = ctx.createLinearGradient(-r, -r, r, r);
    glaze.addColorStop(0, "rgba(255,255,255,0.35)");
    glaze.addColorStop(0.5, "rgba(255,255,255,0)");
    glaze.addColorStop(1, "rgba(0,0,0,0.12)");

    const dx = px - w / 2;
    const dy = py - h / 2;
    const len = Math.hypot(dx, dy) || 1;

    shards.push({
      x: px,
      y: py,
      pts: poly.map(([x, y]) => [(x - px) * 0.86, (y - py) * 0.86]), // 0.86 → Fugen
      r,
      color: colorAt(px, py),
      glaze,
      pattern: Math.random() < 0.05,
      vx: dx / len,
      vy: dy / len,
      dist: 400 + Math.random() * 900,
      spin: (Math.random() - 0.5) * 6,
      delay: (len / Math.hypot(w / 2, h / 2)) * 900 + Math.random() * 250,
    });
  });

  return shards;
}

function drawShard(ctx, s, intro, fly) {
  const scale = easeOut(intro);
  const f = fly * fly;
  const x = s.x + s.vx * s.dist * f;
  const y = s.y + s.vy * s.dist * f + 600 * f * f; // + Schwerkraft

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(s.spin * f);
  ctx.scale(scale, scale);

  ctx.beginPath();
  s.pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
  ctx.closePath();
  ctx.fillStyle = s.color;
  ctx.fill();
  ctx.fillStyle = s.glaze; // Glanz der Glasur
  ctx.fill();

  if (s.pattern) {
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, s.r * 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#d99a2b";
    ctx.beginPath();
    ctx.arc(0, 0, s.r * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const bg = useTransform(scrollYProgress, [0.45, 0.9], ["#f3efe6", "#111111"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.92]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let shards = [];
    let raf;
    const start = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      shards = buildShards(ctx, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = (now) => {
      const fly = clamp(scrollYProgress.get() / 0.7);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (fly < 1) {
        const elapsed = now - start;
        for (const s of shards) drawShard(ctx, s, clamp((elapsed - s.delay) / 500), fly);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [scrollYProgress]);

  const word = "Barcelona";

  return (
    <section ref={sectionRef} className="hero">
      <motion.div className="hero-sticky" style={{ backgroundColor: bg }}>
        <canvas ref={canvasRef} className="hero-canvas" />

        <motion.div className="hero-title-wrap" style={{ opacity: titleOpacity, scale: titleScale }}>
          <h1 className="hero-title">
            {word.split("").map((char, i) => (
              <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
                <motion.span
                  style={{ display: "inline-block" }}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.9 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </h1>
          <p className="hero-sub">2026 · 20.–27. September</p>
        </motion.div>

        <motion.p className="scroll-hint" style={{ opacity: titleOpacity }}>
          scroll ↓
        </motion.p>
      </motion.div>
    </section>
  );
}