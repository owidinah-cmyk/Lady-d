export default function PolicyHeader({ title, lastUpdated }) {
  const dateStr =
    lastUpdated instanceof Date
      ? lastUpdated.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : lastUpdated;
  return (
    <header className="mb-10">
      <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-3">
        {title}
      </h1>
      <p className="text-sm text-muted">
        Last updated: {dateStr}
      </p>
    </header>
  );
}
