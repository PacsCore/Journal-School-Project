import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const MOBILE = "(max-width: 768px)";

export default function Museum({ museum }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [index, setIndex] = useState(0);
  const [preview, setPreview] = useState(null); // welches Bild ist gerade groß offen?
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE).matches);
  const [swiped, setSwiped] = useState(false); // Hinweis "wischen" ausblenden
  const items = museum.items;

  // Handy oder Desktop? Reagiert auf resize / Drehen
  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const measure = () => setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mobile]);

  // Esc schließt die Vorschau
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!mobile) setIndex(Math.min(items.length - 1, Math.floor(p * items.length)));
  });

  // Handy: Index aus der Wisch-Position (Karte 0 ist die Intro-Karte)
  const onSwipe = (e) => {
    const el = e.currentTarget;
    const [first, second] = el.children;
    const step = second ? second.offsetLeft - first.offsetLeft : el.clientWidth;
    const pos = Math.round(el.scrollLeft / step);
    setIndex(Math.min(items.length - 1, Math.max(0, pos - 1)));
    if (el.scrollLeft > 10) setSwiped(true);
  };

  const pad = (n) => String(n).padStart(2, "0");
  const idFor = (i) => `${museum.id}-${i}`;

  const cards = (
    <>
      <article className="room-card room-intro" style={{ background: museum.accent }}>
        <span className="room-nr">{museum.date}</span>
        <h3>{museum.name}</h3>
      </article>

      {items.map((item, i) => (
        <article key={i} className="room-card">
          {item.media &&
            (item.media.type === "video" ? (
              <video className="room-media" src={item.media.src} poster={item.media.poster} autoPlay muted loop playsInline />
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
    </>
  );

  const head = (
    <div className="museum-head">
      <h2>{museum.name}</h2>
      <span>{pad(index + 1)} / {pad(items.length)}</span>
    </div>
  );

  // Handy: natives Wisch-Karussell, kein Scroll-Jacking
  const body = mobile ? (
    <>
      {head}
      <div ref={trackRef} className="museum-carousel" onScroll={onSwipe}>
        {cards}
      </div>
      <div className="museum-dots">
        {items.map((_, i) => <span key={i} className={i === index ? "active" : ""} />)}
      </div>
      {!swiped && <p className="museum-hint">← wischen →</p>}
    </>
  ) : (
    <div className="museum-sticky">
      {head}
      <motion.div ref={trackRef} className="museum-track" style={{ x }}>
        {cards}
      </motion.div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className={mobile ? "museum-mobile" : undefined}
      style={mobile ? undefined : { height: `${(items.length + 1) * 60}vh` }}
    >
      {body}

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