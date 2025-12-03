// src/pages/Historico.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "../styles/Historico.css";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
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

      // Query do Firebase: lê a coleção "historico"
      const q = query(collection(db, "historico"), where("userId", "==", user.uid));

      // Escuta alterações na coleção
      const unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const lista = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();

            // Normaliza os campos que o historicó espera
            return {
              id: docSnap.id,
              medicamento_nome: data.nome || "Sem nome",
              // data.horario_tomado pode ser Timestamp ou string
              horario_tomado: data.horario_tomado
                ? (data.horario_tomado.toDate ? data.horario_tomado.toDate() : new Date(data.horario_tomado))
                : null,
              status: data.status || "desconhecido",
              observacao: data.observacao || "",
            };
          });

          // Ordena por horário (mais recente primeiro)
          lista.sort((a, b) => {
            const ta = a.horario_tomado ? a.horario_tomado.getTime() : 0;
            const tb = b.horario_tomado ? b.horario_tomado.getTime() : 0;
            return tb - ta;
          });

          setHistorico(lista);
          setCarregando(false);
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

  // classes de status
  const statusConfig = {
    tomado: "status-concluido",
    atrasado: "status-pendente",
    pulado: "status-cancelado",
    desconhecido: "status-pendente",
  };

  // agrupa por data
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

  // ---------- Função para limpar todo o histórico do usuário ----------
  const limparHistorico = async () => {
    if (!window.confirm("Tem certeza que deseja APAGAR TODO o histórico? Essa ação é irreversível.")) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado.");

      const ref = collection(db, "historico");
      const q = query(ref, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      const promises = snapshot.docs.map((d) =>
        deleteDoc(doc(db, "historico", d.id))
      );

      await Promise.all(promises);

      // limpa o estado local
      setHistorico([]);
      alert("Histórico apagado com sucesso!");
    } catch (error) {
      console.error("Erro ao apagar histórico:", error);
      alert("Erro ao apagar o histórico: " + (error.message || error));
    }
  };

  return (
    <div className="historico-container">
      <button onClick={() => navigate("/home")} className="btn-voltar">
        ← Voltar
      </button>

      <h1 className="historico-title">Histórico de Medicamentos</h1>

      {/* botão Limpar — colocado logo abaixo do título */}
      <button className="btn-limpar" onClick={limparHistorico}>
        Limpar Histórico
      </button>

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