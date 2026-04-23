import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState([]);
  const [totalAvailableTime, setTotalAvailableTime] = useState(6);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [showExplain, setShowExplain] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await api.get("/subjects");
        setSubjects(data);
      } catch {
        toast.error("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const generatePlan = async () => {
    try {
      const { data } = await api.post("/planner/generate", { totalAvailableTime: Number(totalAvailableTime) });
      setResult(data);
      toast.success("Optimal plan generated and saved in history");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate plan");
    }
  };

  return (
    <section className="space-y-6">
      <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h3 className="text-xl font-semibold text-white">Dynamic Programming Study Planner</h3>
        <p className="mt-2 text-sm text-slate-300">
          Uses 0/1 Knapsack to maximize score by selecting the best subset of subjects within your available time.
        </p>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
          <div>
            <label className="block text-sm text-slate-300">Total Available Time (hours)</label>
            <input
              type="number"
              min="1"
              value={totalAvailableTime}
              onChange={(e) => setTotalAvailableTime(e.target.value)}
              className="mt-1 w-56 rounded-xl border border-white/15 bg-slate-950/80 px-4 py-2 text-white"
            />
          </div>
          <button
            onClick={generatePlan}
            className="rounded-xl bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Generate Optimal Plan
          </button>
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h3 className="text-lg font-semibold text-white">How To Fill Study Plan (Easy Guide)</h3>
        <p className="mt-2 text-sm text-slate-300">
          Follow these steps in order. This is the same flow as adding subjects in a blank form.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-sm font-semibold text-cyan-200">Step 1: Add Subject Details</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-200">
              <li>Subject Name: Example "Math"</li>
              <li>Difficulty: Easy / Medium / Hard</li>
              <li>Time Required: Hours needed to complete</li>
              <li>Weightage: Marks importance in exam</li>
            </ul>
            <Link to="/subjects" className="mt-3 inline-block rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-300">
              Go To Add Subjects
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-sm font-semibold text-cyan-200">Step 2: Set Available Hours</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-200">
              <li>Enter total study hours for today</li>
              <li>Click Generate Optimal Plan</li>
              <li>Planner selects best subjects in your time limit</li>
              <li>Read AI suggestion + explain steps</li>
            </ul>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h3 className="text-lg font-semibold text-white">Current Subjects</h3>
        {loading ? (
          <p className="mt-3 text-slate-300">Loading...</p>
        ) : subjects.length === 0 ? (
          <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <p>No subjects found yet. Add subjects with hours and weightage first, then generate a plan.</p>
            <Link to="/subjects" className="mt-3 inline-block rounded-lg border border-amber-300/40 px-3 py-1.5 font-semibold text-amber-100 hover:bg-amber-300/10">
              Add Your First Subject
            </Link>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="pb-2">Subject</th>
                  <th className="pb-2">Difficulty</th>
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Weightage</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className="border-t border-white/10 text-slate-200">
                    <td className="py-2">{subject.name}</td>
                    <td>{subject.difficulty}</td>
                    <td>{subject.timeRequired}</td>
                    <td>{subject.weightage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      {result && (
        <article className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-5">
          <h3 className="text-lg font-semibold text-cyan-200">Optimal Plan Result</h3>
          <p className="mt-2 text-slate-100">Predicted Score: {result.predictedScore}</p>
          <p className="text-slate-100">Used Time: {result.usedTime} / {result.totalTime}</p>
          <p className="mt-2 text-sm text-cyan-100">AI Suggestion: {result.aiSuggestion}</p>

          <ul className="mt-4 space-y-2 text-sm text-slate-100">
            {result.selectedSubjects.map((subject) => (
              <li key={subject._id} className="rounded-lg border border-white/10 bg-slate-900/50 p-3">
                {subject.name} | Time: {subject.timeRequired} | Weight: {subject.weightage}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowExplain((prev) => !prev)}
            className="mt-4 rounded-xl border border-cyan-300/40 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-300/10"
          >
            {showExplain ? "Hide Explain Plan" : "Explain Plan"}
          </button>

          {showExplain && (
            <div className="mt-3 rounded-lg border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-200">
              {result.explainSteps.map((step, index) => (
                <p key={index} className="mb-2">{index + 1}. {step}</p>
              ))}
            </div>
          )}
        </article>
      )}
    </section>
  );
}
