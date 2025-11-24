// src/hooks/useNotificacoes.js
import { useEffect, useRef } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import { pedirPermissaoNotificacao, agendarNotificacao } from "../services/notifications";

/**
 * Hook global para gerenciar notificações de remédios
 * - Pede permissão ao usuário
 * - Observa remédios do Firebase
 * - Agenda notificações futuras
 * - Evita duplicações e limpa timers no cleanup
 */
export default function useNotificacoes() {
  const notificacoesAgendadas = useRef(new Set()); // evita duplicação
  const timers = useRef({}); // armazena timers para cancelamento

  useEffect(() => {
    // Solicita permissão
    pedirPermissaoNotificacao();

    // Observa autenticação do usuário
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      // Query remédios do usuário
      const q = query(collection(db, "remedios"), where("userId", "==", user.uid));

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const remedio = {
            id: doc.id,
            medicamento_nome: data.nome || "Sem nome",
            horario_tomado: data.horario ? data.horario.toDate() : null,
          };

          const key = `${remedio.id}_${remedio.horario_tomado?.getTime()}`;

          // Evita duplicação
          if (!notificacoesAgendadas.current.has(key) && remedio.horario_tomado) {
            const agora = new Date();
            const delay = remedio.horario_tomado.getTime() - agora.getTime();

            if (delay > 0) {
              const timer = setTimeout(() => {
                agendarNotificacao(remedio);
              }, delay);

              timers.current[key] = timer;
              notificacoesAgendadas.current.add(key);
            }
          }
        });
      });

      // Cleanup listener Firestore
      return () => unsubscribeSnapshot();
    });

    // Cleanup listener Auth e timers
    return () => {
      unsubscribeAuth();
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
      notificacoesAgendadas.current.clear();
    };
  }, []);
}



