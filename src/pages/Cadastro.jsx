import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import "../styles/Cadastro.css";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [dose, setDose] = useState("");
  const [horario, setHorario] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!nome || !dose || !horario) {
      alert("Preencha todos os campos!");
      return;
    }

    // Converte "10:30" para um Date HOJE às 10:30
    const [hora, minuto] = horario.split(":");
    const horarioDate = new Date();
    horarioDate.setHours(hora, minuto, 0, 0);

    try {
      await addDoc(collection(db, "remedios"), {
        nome,
        dose,
        horario: Timestamp.fromDate(horarioDate), // ⬅ AGORA É TIMESTAMP!
        userId: auth.currentUser.uid,
        tomado: false, // ⬅ IMPORTANTE!
        observacao: "" // opcional
      });

      alert("Medicamento cadastrado com sucesso!");
      navigate("/home");

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar no Firebase.");
    }
  };

  return (
    <div className="cadastro-container">
      <Link to="/home" className="btn-voltar">← Voltar</Link>

      <h1 className="cadastro-title">Cadastrar Medicamento</h1>

      <div className="cadastro-card">

        <label className="cadastro-label">Nome do medicamento</label>
        <input
          type="text"
          className="cadastro-input"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label className="cadastro-label">Dose</label>
        <input
          type="text"
          className="cadastro-input"
          value={dose}
          onChange={(e) => setDose(e.target.value)}
        />

        <label className="cadastro-label">Horário</label>
        <input
          type="time"
          className="cadastro-input"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
        />

        <button className="btn-salvar" onClick={handleSave}>
          Salvar Medicamento
        </button>
      </div>
    </div>
  );
}


