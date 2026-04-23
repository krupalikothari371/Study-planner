import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const defaultForm = {
  name: "",
  difficulty: "Medium",
  timeRequired: 1,
  weightage: 10,
};

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  const fetchSubjects = async () => {
    const { data } = await api.get("/subjects");
    setSubjects(data);
  };

  useEffect(() => {
    const loadSubjects = async () => {
      await fetchSubjects();
    };

    loadSubjects();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/subjects/${editingId}`, form);
        toast.success("Subject updated");
      } else {
        await api.post("/subjects", form);
        toast.success("Subject added");
      }
      setForm(defaultForm);
      setEditingId(null);
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save subject");
    }
  };

  const onEdit = (subject) => {
    setEditingId(subject._id);
    setForm({
      name: subject.name,
      difficulty: subject.difficulty,
      timeRequired: subject.timeRequired,
      weightage: subject.weightage,
    });
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      toast.success("Subject deleted");
      fetchSubjects();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <section className="grid gap-5 xl:grid-cols-5">
      <form onSubmit={submitForm} className="xl:col-span-2 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h3 className="text-lg font-semibold text-white">{editingId ? "Edit Subject" : "Add Subject"}</h3>

        <div className="mt-4 space-y-3">
          <input
            placeholder="Subject name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white"
          />
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <input
            type="number"
            min="1"
            value={form.timeRequired}
            onChange={(e) => setForm({ ...form, timeRequired: Number(e.target.value) })}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white"
          />
          <input
            type="number"
            min="1"
            value={form.weightage}
            onChange={(e) => setForm({ ...form, weightage: Number(e.target.value) })}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white"
          />
        </div>

        <button className="mt-4 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300">
          {editingId ? "Update Subject" : "Add Subject"}
        </button>
      </form>

      <article className="xl:col-span-3 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h3 className="text-lg font-semibold text-white">Subject List</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2">Name</th>
                <th className="pb-2">Difficulty</th>
                <th className="pb-2">Time</th>
                <th className="pb-2">Weightage</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id} className="border-t border-white/10 text-slate-200">
                  <td className="py-2">{subject.name}</td>
                  <td>{subject.difficulty}</td>
                  <td>{subject.timeRequired}</td>
                  <td>{subject.weightage}</td>
                  <td className="space-x-2">
                    <button onClick={() => onEdit(subject)} className="rounded px-2 py-1 text-cyan-300 hover:bg-cyan-500/15">
                      Edit
                    </button>
                    <button onClick={() => onDelete(subject._id)} className="rounded px-2 py-1 text-rose-300 hover:bg-rose-500/15">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
