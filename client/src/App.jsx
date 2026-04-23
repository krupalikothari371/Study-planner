import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import StudyPlanner from "./pages/StudyPlanner";
import Subjects from "./pages/Subjects";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="planner" element={<StudyPlanner />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
