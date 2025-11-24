// src/services/notifications.js

/**
 * Solicita permissão para notificações do navegador
 */
export function pedirPermissaoNotificacao() {
  if ("Notification" in window) {
    Notification.requestPermission().then((perm) => {
      if (perm !== "granted") {
        alert("Permissão para notificação negada!");
      }
    });
  } else {
    console.warn("Notificações não são suportadas neste navegador.");
  }
}

/**
 * Agenda uma notificação para um remédio
 * @param {Object} remedio - Objeto com id, medicamento_nome e horario_tomado (Date)
 */
export function agendarNotificacao(remedio) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (!remedio.horario_tomado) return;

  const agora = new Date();
  const horario = new Date(remedio.horario_tomado);

  if (horario <= agora) return; // ignora horários passados

  const delay = horario.getTime() - agora.getTime();

  setTimeout(() => {
    new Notification("Hora do remédio!", {
      body: `É hora de tomar ${remedio.medicamento_nome}`,
    });
  }, delay);
}

