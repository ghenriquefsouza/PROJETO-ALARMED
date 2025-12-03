// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {collection,onSnapshot, query,where,doc,deleteDoc,updateDoc,} from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import "../styles/home.css";
import { signOut } from "firebase/auth";
import { addDoc } from "firebase/firestore";

export default function Home() {
  const [medicamentos, setMedicamentos] = useState([]);
  const navigate = useNavigate();

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Buscar medicamentos do usuário logado
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setMedicamentos([]);
        navigate("/login");
        return;
      }

      const q = query(
        collection(db, "remedios"),
        where("userId", "==", user.uid)
      );

      const unsubSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const lista = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setMedicamentos(lista);
        },
        (err) => {
          console.error("Erro ao carregar dados:", err);
        }
      );

      // 🔥 Aqui é o retorno correto!
      return () => unsubSnapshot();
    });

    return () => unsubAuth();
  }, [navigate]);

  // Deletar medicamento
  const handleDelete = async (id) => {
    if (!auth.currentUser) return;

    if (!window.confirm("Deseja realmente excluir este medicamento?")) return;

    try {
      await deleteDoc(doc(db, "remedios", id));
      alert("Medicamento excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir o medicamento: " + err.message);
    }
  };
  // Marcar/desmarcar como tomado
  const handleTomar = async (id, tomadoAtual) => {
  try {
    // Buscar o documento do remédio atual
    const remedio = medicamentos.find((r) => r.id === id);

    await updateDoc(doc(db, "remedios", id), {
      tomado: !tomadoAtual,
    });

    // Registrar no histórico no formato correto
    await addDoc(collection(db, "historico"), {
      remedioId: id,
      userId: auth.currentUser.uid,
      nome: remedio.nome,
      horario_tomado: new Date(),
      status: !tomadoAtual ? "tomado" : "pulado",
      observacao: "",
    });

  } catch (err) {
    console.error("Erro ao atualizar:", err);
    alert("Erro ao atualizar o medicamento: " + err.message);
  }
};
  return (
    <div className="home-container">
      <div className="home-wrapper fade-in">

        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>

        <header className="header-center">
          <div className="icon-pill">💊</div>
          <h1 className="titulo-app">
            ALAR<span>MED</span>
          </h1>
          <p className="subtitulo-app">
            Seu controle de medicamentos de forma simples e moderna.
          </p>
        </header>

        <div className="botoes-container">
          <Link to="/historico" className="btn-historico">Histórico</Link>
          <Link to="/cadastro" className="btn-add">Cadastrar Medicamento</Link>
        </div>

        <div className="grid-cards">
          {medicamentos.map((m) => (
            <div key={m.id} className="medicamento-card">
              <h3 className="medicamento-nome">{m.nome || "Sem nome"}</h3>

              <p className="medicamento-info">Dose: {m.dose || "-"}</p>

              <span className="horario-badge">
  ⏰ 
  {m.horario
    ? typeof m.horario === "string"
      ? m.horario                             
      : new Date(m.horario.seconds * 1000)    
          .toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })
    : "Horário não definido"}
</span>

              {m.tomado && <span className="badge-tomado">✔ Tomado</span>}

              <div className="card-actions">
                <button
                  className="btn-action btn-tomar"
                  onClick={() => handleTomar(m.id, m.tomado ?? false)}
                >
                  {m.tomado ? "Desmarcar" : "Tomar"}
                </button>

                <button
                  className="btn-action btn-editar"
                  onClick={() => navigate(`/editar/${m.id}`)}
                >
                  Editar
                </button>

                <button
                  className="btn-action btn-excluir"
                  onClick={() => handleDelete(m.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
