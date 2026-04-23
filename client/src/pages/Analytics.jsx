import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import api from "../services/api";

export default function Analytics() {
  const [history, setHistory] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [historyRes, subjectsRes] = await Promise.all([api.get("/history"), api.get("/subjects")]);
      setHistory(historyRes.data);
      setSubjects(subjectsRes.data);
    };
    fetchData();
  }, []);

  const trendData = history
    .slice(0, 10)
    .reverse()
    .map((item, index) => ({
      run: index + 1,
      score: item.predictedScore,
      totalTime: item.totalTime,
    }));

  const radarData = subjects.map((s) => ({
    subject: s.name,
    weightage: s.weightage,
    timeRequired: s.timeRequired,
  }));

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h3 className="text-lg font-semibold text-white">Score Prediction Trend</h3>
        <div className="mt-4 h-80">
          <ResponsiveContainer>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="run" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#22d3ee" fillOpacity={1} fill="url(#scoreGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h3 className="text-lg font-semibold text-white">Subject Time vs Weightage</h3>
        <div className="mt-4 h-80">
          <ResponsiveContainer>
            <RadarChart data={radarData} outerRadius={120}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis dataKey="subject" stroke="#cbd5e1" />
              <Radar dataKey="weightage" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.4} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
