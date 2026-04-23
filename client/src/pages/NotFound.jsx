import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <p className="text-6xl font-semibold text-cyan-300">404</p>
        <p className="mt-2 text-slate-300">Page not found</p>
        <Link to="/" className="mt-4 inline-block rounded-xl border border-cyan-300/40 px-4 py-2 text-cyan-200">
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}
