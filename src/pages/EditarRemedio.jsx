// src/pages/EditarRemedio.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import "../styles/Cadastro.css"; // reutilizando o estilo do Cadastro

export default function EditarRemedio() {
  const { id } = useParams(); // pega o id do medicamento
  const [nome, setNome] = useState("");
  const [dose, setDose] = useState("");
  const [horario, setHorario] = useState("");
  const navigate = useNavigate();

  // Carregar os dados do medicamento
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "remedios", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Garante que o usuário logado é o dono
          if (data.userId !== auth.currentUser.uid) {
            alert("Você não tem permissão para editar este medicamento.");
            navigate("/home");
            return;
          }

          setNome(data.nome);
          setDose(data.dose);
          setHorario(data.horario?.slice(0,5) || "" );

        } else {
          alert("Medicamento não encontrado.");
          navigate("/home");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar o medicamento.");
        navigate("/home");
      }
    };

    fetchData();
  }, [id, navigate]);

  // Salvar alterações
  const handleSave = async () => {
    if (!nome || !dose || !horario) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const docRef = doc(db, "remedios", id);
      await updateDoc(docRef, { nome, dose, horario: horario.slice(0,5) });
      alert("Medicamento atualizado com sucesso!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar o medicamento.");
    }
  };

  return (
    <div className="cadastro-container">
      <Link to="/home" className="btn-voltar">← Voltar</Link>
      <h1 className="cadastro-title">Editar Medicamento</h1>

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
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
