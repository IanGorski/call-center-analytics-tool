import BajasForm from "../components/BajasForm";

export default function Bajas({ showToast }) {
  return (
    <div>
      <h2>Registro de Bajas</h2>
      <BajasForm showToast={showToast} />
    </div>
  );
}
