import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { rooms } from "../data/museum";

export default function Museum() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [index, setIndex] = useState(0);

  useLayoutEffect(() => {
    const measure = () =>
      setDistance(trackRef.current.scrollWidth - window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setIndex(Math.min(rooms.length - 1, Math.floor(p * rooms.length)))
  );

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section id="museum" ref={sectionRef} style={{ height: `${rooms.length * 60}vh` }}>
      <div className="museum-sticky">
        <div className="museum-head">
          <h2>Museu Picasso</h2>
          <span>{pad(index + 1)} / {pad(rooms.length)}</span>
        </div>

        <motion.div ref={trackRef} className="museum-track" style={{ x }}>
          {rooms.map((r) => (
            <article key={r.nr} className="room-card">
              <span className="room-nr">Raum {r.nr}</span>
              <h3>{r.title}</h3>
              <p>{r.note}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}