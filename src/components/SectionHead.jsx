export default function SectionHead({ title, children, light = false }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className={`font-display text-4xl font-extrabold tracking-tight sm:text-5xl ${light ? "text-ink" : "text-white"}`}>
        {title}
      </h2>
      {children && (
        <p className={`mt-3 text-lg leading-relaxed ${light ? "text-ink/70" : "text-mist/75"}`}>{children}</p>
      )}
    </div>
  );
}
