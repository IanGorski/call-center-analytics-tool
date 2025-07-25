
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, UserX, User, BarChart3, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import "./Sidebar.css";

const menu = [
  { path: "/", label: "Casos", icon: <FileText size={20} /> },
  { path: "/bajas", label: "Bajas", icon: <UserX size={20} /> },
];

export default function Sidebar() {
  const location = useLocation();
  const [nombre, setNombre] = useState("");
  const [dashboardOpen, setDashboardOpen] = useState(false);
  
  useEffect(() => {
    // Función para actualizar el nombre desde localStorage
    function updateNombre() {
      setNombre(localStorage.getItem("userNombre") || "");
    }
    
    // Actualizar inicial
    updateNombre();
    
    // Polling cada 500ms para detectar cambios
    const interval = setInterval(updateNombre, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="sidebar" role="complementary" aria-label="Menú lateral">
      <div className="sidebar-header">
        <Home size={28} aria-hidden="true" />
        <span className="sidebar-title">CAT Call Center</span>
      </div>
      <nav role="navigation" aria-label="Navegación principal">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={
              location.pathname === item.path ? "sidebar-link active" : "sidebar-link"
            }
            aria-current={location.pathname === item.path ? "page" : undefined}
            tabIndex={0}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        
        {/* Dashboard desplegable */}
        <div className="sidebar-dropdown">
          <button
            className={`sidebar-link dashboard-toggle ${dashboardOpen ? 'open' : ''}`}
            onClick={() => setDashboardOpen(!dashboardOpen)}
            aria-expanded={dashboardOpen}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
            {dashboardOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {dashboardOpen && (
            <div className="sidebar-submenu">
              <Link to="/dashboard/general" className="sidebar-sublink">
                Resumen General
              </Link>
              <Link to="/dashboard/casos" className="sidebar-sublink">
                Análisis de Casos
              </Link>
              <Link to="/dashboard/bajas" className="sidebar-sublink">
                Reporte de Bajas
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/usuario"
          className={
            (location.pathname === "/usuario" ? "sidebar-link active personal" : "sidebar-link personal")
          }
          aria-current={location.pathname === "/usuario" ? "page" : undefined}
          tabIndex={0}
        >
          <User size={20} aria-hidden="true" />
          <span>{nombre ? nombre : "Personalización"}</span>
        </Link>
      </nav>
    </aside>
  );
}
