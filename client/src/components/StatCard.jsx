export default function StatCard({ title, value, hint }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_10px_30px_rgba(3,7,18,0.35)]">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold text-white">{value}</h3>
      <p className="mt-2 text-sm text-slate-300">{hint}</p>
    </article>
  );
}
