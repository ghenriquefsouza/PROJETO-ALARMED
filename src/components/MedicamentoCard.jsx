// src/components/medicamentos/MedicamentoCard.jsx
export default function MedicamentoCard({ medicamento, onRegistrarTomada, onEditar, onExcluir }) {
  return (
    <div className="p-4 bg-white rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-bold">{medicamento.nome || "Sem nome"}</h3>
        <p className="text-sm text-gray-600">Dose: {medicamento.dose || "-"}</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onRegistrarTomada(medicamento)} className="px-3 py-1 bg-blue-500 text-white rounded">Tomar</button>
        <button onClick={() => onEditar(medicamento)} className="px-3 py-1 bg-yellow-500 text-white rounded">Editar</button>
        <button onClick={() => onExcluir(medicamento.id)} className="px-3 py-1 bg-red-500 text-white rounded">Excluir</button>
      </div>
    </div>
  );
}
