import { useEffect, useState } from "react";
import api from "../services/api";

export default function History() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await api.get("/history");
      setPlans(data);
    };
    fetchHistory();
  }, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">Saved Plans History</h3>

      <div className="mt-4 space-y-4">
        {plans.map((plan) => (
          <article key={plan._id} className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-cyan-200">Score: {plan.predictedScore}</p>
              <p className="text-sm text-slate-400">{new Date(plan.createdAt).toLocaleString()}</p>
            </div>
            <p className="mt-2 text-sm text-slate-300">Total Time: {plan.totalTime} hours</p>
            <p className="mt-1 text-sm text-slate-300">Subjects: {plan.selectedSubjects.map((s) => s.name).join(", ") || "None"}</p>
            <p className="mt-2 text-sm text-cyan-100">Improvement note: {plan.aiSuggestion}</p>
          </article>
        ))}

        {!plans.length && <p className="text-slate-300">No plans generated yet.</p>}
      </div>
    </section>
  );
}
