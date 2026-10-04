import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export default function Museum({ museum }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [index, setIndex] = useState(0);
  const items = museum.items;

  useLayoutEffect(() => {
    const measure = () => setDistance(trackRef.current.scrollWidth - window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setIndex(Math.min(items.length - 1, Math.floor(p * items.length)))
  );

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section ref={sectionRef} style={{ height: `${(items.length + 1) * 60}vh` }}>
      <div className="museum-sticky">
        <div className="museum-head">
          <h2>{museum.name}</h2>
          <span>{pad(index + 1)} / {pad(items.length)}</span>
        </div>

        <motion.div ref={trackRef} className="museum-track" style={{ x }}>
          {/* Titelkarte in der Farbe des Museums */}
          <article className="room-card room-intro" style={{ background: museum.accent }}>
            <span className="room-nr">{museum.date}</span>
            <h3>{museum.name}</h3>
          </article>

          {items.map((item, i) => (
            <article key={i} className="room-card">
              {item.media &&
                (item.media.type === "video" ? (
                  <video className="room-media" src={item.media.src} autoPlay muted loop playsInline />
                ) : (
                  <img className="room-media" src={item.media.src} alt={item.title} />
                ))}
              <span className="room-nr">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}