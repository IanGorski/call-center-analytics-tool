import Dashboard from "../components/Dashboard";
import "./Dashboard.css";

export default function DashboardGeneral({ showToast }) {
  return (
    <div className="dashboard-page">
      <h1>Dashboard General</h1>
      <p>Resumen completo de la actividad del call center</p>
      <Dashboard showToast={showToast} />
    </div>
  );
}
