import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { trip } from "../data/trip";

const COLORS = ["#2b5bb5", "#2a9d9a", "#d99a2b", "#b8432b", "#6b8e3a"];
const ease = [0.22, 1, 0.36, 1];

export default function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });

  return (
    <section id="zeitleiste" ref={ref} className="timeline">
      <header className="timeline-head">
        <p>Sieben Tage</p>
        <h2>Die Woche</h2>
      </header>

      <div className="timeline-body">
        <motion.div className="timeline-line" style={{ scaleY: scrollYProgress }} />

        {trip.map((day, i) => (
          <motion.article
            key={day.date}
            className={`day ${i % 2 ? "right" : "left"}`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 0.8, ease }}
          >
            <motion.span
              className="day-dot"
              style={{ background: COLORS[i % COLORS.length] }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
            />
            <div className="day-date">
              <span>{day.weekday}</span>
              {day.date}
            </div>
            <h3>{day.title}</h3>
            <p className="day-place">{day.place}</p>
            <ul>
              {day.items.map((item, j) => (
                <li key={j}>
                  <span>{item.time}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}