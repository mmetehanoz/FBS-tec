export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="space-y-2 px-5 pb-4 pt-6">
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl font-black leading-tight text-slate-950">{title}</h1>
      {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
    </header>
  );
}
