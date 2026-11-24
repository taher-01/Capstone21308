export function PagePlaceholder({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-brand-900">{title}</h2>
      <p className="mt-2 text-sm text-ink-muted">{text}</p>
    </div>
  );
}