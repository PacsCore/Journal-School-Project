const links = [
  { label: "Tage", href: "#tage" },
  { label: "Museum", href: "#museum" },
  { label: "Sounds", href: "#sounds" },
  { label: "Tisch", href: "#tisch" },
];

function RollLink({ label, href }) {
  return (
    <a className="roll" href={href}>
      <span className="roll-inner">
        <span>{label}</span>
        <span className="roll-copy">{label}</span>
      </span>
    </a>
  );
}

export default function Nav() {
  return (
    <nav className="nav">
      <RollLink label="BCN ’26" href="#top" />
      <div style={{ display: "flex", gap: "2rem" }}>
        {links.map((l) => <RollLink key={l.href} {...l} />)}
      </div>
    </nav>
  );
}