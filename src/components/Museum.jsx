import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export default function Museum({ museum }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [index, setIndex] = useState(0);
  const [preview, setPreview] = useState(null); // welches Bild ist gerade groß offen?
  const items = museum.items;

  useLayoutEffect(() => {
    const measure = () => setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Esc schließt die Vorschau
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setIndex(Math.min(items.length - 1, Math.floor(p * items.length)))
  );

  const pad = (n) => String(n).padStart(2, "0");
  const idFor = (i) => `${museum.id}-${i}`;

  return (
    <section ref={sectionRef} style={{ height: `${(items.length + 1) * 60}vh` }}>
      <div className="museum-sticky">
        <div className="museum-head">
          <h2>{museum.name}</h2>
          <span>{pad(index + 1)} / {pad(items.length)}</span>
        </div>

        <motion.div ref={trackRef} className="museum-track" style={{ x }}>
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
                  <motion.img
                    layoutId={idFor(i)}
                    className="room-media clickable"
                    src={item.media.src}
                    alt={item.title}
                    onClick={() => setPreview({ ...item, id: idFor(i) })}
                  />
                ))}
              <span className="room-nr">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </motion.div>
      </div>

      {/* Lightbox – per Portal direkt in <body>, damit sie über allem liegt */}
      {createPortal(
        <AnimatePresence>
          {preview && (
            <motion.div
              className="lightbox"
              onClick={() => setPreview(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.img layoutId={preview.id} src={preview.media.src} alt={preview.title} />
              <motion.div
                className="lightbox-caption"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span>{preview.label}</span>
                <h3>{preview.title}</h3>
                <p>{preview.note}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}