// src/components/medicamentos/MedicamentoForm.jsx
import { useState, useEffect } from "react";

export default function MedicamentoForm({ medicamento, onSalvar, onCancelar }) {
  const [form, setForm] = useState({ nome: "", dose: "" });

  useEffect(() => {
    if (medicamento) setForm(medicamento);
  }, [medicamento]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold text-lg mb-3">{medicamento ? "Editar" : "Novo"} Medicamento</h2>

      <input
        name="nome"
        placeholder="Nome"
        value={form.nome}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        name="dose"
        placeholder="Dose"
        value={form.dose}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />

      <div className="flex gap-3 mt-3">
        <button
          onClick={() => onSalvar(form)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Salvar
        </button>
        <button
          onClick={onCancelar}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
