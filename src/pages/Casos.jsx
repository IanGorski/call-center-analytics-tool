
import CasosTable from "../components/CasosTable";

export default function Casos({ showToast }) {
  return (
    <div>
      <h2>Seguimiento de Casos</h2>
      <CasosTable showToast={showToast} />
    </div>
  );
}
