// src/pages/Historico.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "../styles/Historico.css";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";

export default function Historico() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    // Observa autenticação
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      // Query do Firebase
      const q = query(collection(db, "remedios"), where("userId", "==", user.uid));

      // Escuta alterações na coleção
      const unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const lista = snapshot.docs.map((doc) => {
            const data = doc.data();

            // Fallback para todos os campos
            return {
              id: doc.id,
              medicamento_nome: data.nome || "Sem nome",
              horario_tomado: data.horario ? data.horario.toDate() : null,
              status:
                data.tomado === true
                  ? "tomado"
                  : data.tomado === false
                  ? "atrasado"
                  : "pulado",
              observacao: data.observacao || "",
            };
          });

          setHistorico(lista);
          setCarregando(false);
          console.log("Dados do histórico:", lista);
        },
        (error) => {
          console.error("Erro ao buscar histórico:", error);
          setCarregando(false);
        }
      );

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Filtra por status
  const historicoFiltrado =
    filtroStatus === "todos"
      ? historico
      : historico.filter((h) => h.status === filtroStatus);

  // Configura classes de status
  const statusConfig = {
    tomado: "status-concluido",
    atrasado: "status-pendente",
    pulado: "status-cancelado",
  };

  // Agrupa por data
  const agruparPorData = (items) => {
    const grupos = {};
    items.forEach((item) => {
      const data = item.horario_tomado
        ? format(item.horario_tomado, "dd/MM/yyyy")
        : "Sem data";
      if (!grupos[data]) grupos[data] = [];
      grupos[data].push(item);
    });
    return grupos;
  };

  const grupos = agruparPorData(historicoFiltrado);

  return (
    <div className="historico-container">
      <button onClick={() => navigate("/home")} className="btn-voltar">
        ← Voltar
      </button>

      <h1 className="historico-title">Histórico de Medicamentos</h1>

      <div className="filtro-container">
        <label>
          Filtrar por status:{" "}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="filtro-select"
          >
            <option value="todos">Todos</option>
            <option value="tomado">Tomado</option>
            <option value="atrasado">Atrasado</option>
            <option value="pulado">Pulado</option>
          </select>
        </label>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : historicoFiltrado.length === 0 ? (
        <p>Nenhum registro encontrado</p>
      ) : (
        <ul className="historico-list">
          {Object.entries(grupos).map(([data, items]) => (
            <div key={data}>
              <h3 className="data">{data}</h3>
              {items.map((item) => (
                <li key={item.id} className="historico-item">
                  <div>
                    <span className="cliente">{item.medicamento_nome}</span>
                    <span className="data">
                      {item.horario_tomado && !isNaN(item.horario_tomado.getTime())
                        ? format(item.horario_tomado, "HH:mm")
                        : "--:--"}
                    </span>

                    {item.observacao && (
                      <div style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                        “{item.observacao}”
                      </div>
                    )}
                  </div>

                  <span className={`status ${statusConfig[item.status] || ""}`}>
                    {item.status || "desconhecido"}
                  </span>
                </li>
              ))}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
