// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, onSnapshot, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import "../styles/home.css";
import { signOut } from "firebase/auth";

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
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setMedicamentos([]);
        navigate("/login");
        return;
      }

      const q = query(
        collection(db, "remedios"),
        where("userId", "==", user.uid)
      );

      const unsubSnapshot = onSnapshot(q, (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedicamentos(lista);
      });

      return () => unsubSnapshot();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Deletar medicamento
  const handleDelete = async (id) => {
    if (!auth.currentUser) return;

    const confirm = window.confirm("Deseja realmente excluir este medicamento?");
    if (!confirm) return;

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
      const docRef = doc(db, "remedios", id);
      await updateDoc(docRef, {
        tomado: !tomadoAtual,
      });
      alert("Medicamento atualizado!");
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
              <h3 className="medicamento-nome">{m.nome}</h3>
              <p className="medicamento-info">Dose: {m.dose}</p>
              <span className="horario-badge">⏰ {m.horario}</span>
              {m.tomado && <span className="badge-tomado">✔ Tomado</span>}

              <div className="card-actions">
                <button
                  className="btn-action btn-tomar"
                  onClick={() => handleTomar(m.id, m.tomado || false)}
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
