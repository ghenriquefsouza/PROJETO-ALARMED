// src/components/medicamentos/DialogTomada.jsx
export default function DialogTomada({ aberto, medicamento, onFechar, onConfirmar }) {

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="font-bold text-lg mb-2">Registrar Tomada</h2>
        <p className="text-sm mb-4">Confirmar tomada do medicamento:</p>
        <p className="font-medium mb-4">{medicamento?.nome}</p>

        <div className="flex gap-2">
          <button
            onClick={() =>
              onConfirmar({ medicamentoId: medicamento.id, data: new Date() })
            }
            className="flex-1 bg-green-500 text-white py-2 rounded"
          >
            Confirmar
          </button>
          <button onClick={onFechar} className="flex-1 bg-gray-300 py-2 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
