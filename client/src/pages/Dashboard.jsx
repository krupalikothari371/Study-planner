import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import api from "../services/api";

const COLORS = ["#22d3ee", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1"];

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, historyRes] = await Promise.all([api.get("/subjects"), api.get("/history")]);
        setSubjects(subjectsRes.data);
        setHistory(historyRes.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const metrics = useMemo(() => {
    const totalHours = subjects.reduce((sum, s) => sum + s.timeRequired, 0);
    const predictedScore = history[0]?.predictedScore || 0;
    const avgScore = history.length
      ? Math.round(history.reduce((sum, p) => sum + p.predictedScore, 0) / history.length)
      : 0;
    return { totalHours, predictedScore, avgScore };
  }, [subjects, history]);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Study Hours" value={metrics.totalHours} hint="Total required hours across all subjects" />
        <StatCard title="Subjects Added" value={subjects.length} hint="Ready for planner optimization" />
        <StatCard title="Predicted Score" value={metrics.predictedScore} hint="Latest generated plan score" />
        <StatCard title="Average Score" value={metrics.avgScore} hint="Mean score across history" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-slate-900/75 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Study Time Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={subjects} dataKey="timeRequired" nameKey="name" outerRadius={100} label>
                  {subjects.map((entry, index) => (
                    <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900/75 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Prediction Trend</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={history.slice(0, 8).map((p, i) => ({ name: `Plan ${history.length - i}`, score: p.predictedScore }))}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="score" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}
