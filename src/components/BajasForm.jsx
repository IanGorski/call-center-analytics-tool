import TableManager from "./TableManager";

const bajasColumns = [
  { key: "numero", label: "Número de caso", type: "text" },
  { key: "servicio", label: "Servicio", type: "text" },
  { key: "motivo", label: "Motivo", type: "text" },
  { key: "dni", label: "DNI", type: "text" },
  { key: "cuenta", label: "Cuenta", type: "text" },
  { key: "gestion", label: "Gestión", type: "text" },
];
const bajasFilters = [
  { key: "motivo", label: "Motivo" },
  { key: "servicio", label: "Servicio" },
];

export default function BajasForm({ showToast }) {
  return (
    <TableManager
      storageKey="bajasPorDia"
      title="Bajas"
      showToast={showToast}
      defaultForm={{ numero: "", servicio: "", motivo: "", dni: "", cuenta: "", gestion: "" }}
      columns={bajasColumns}
      filters={bajasFilters}
    />
  );
}