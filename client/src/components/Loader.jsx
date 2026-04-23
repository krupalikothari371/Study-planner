export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-55 flex-col items-center justify-center gap-3">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-500/30 border-t-cyan-400" />
      <p className="text-sm text-slate-300">{text}</p>
    </div>
  );
}
