const subjApproved = (id) => `Decisión de tu solicitud ${id}: APROBADA`;
const subjRejected = (id) => `Decisión de tu solicitud ${id}: RECHAZADA`;
const subjManual = (id) => `Decisión de tu solicitud ${id}: REVISION MANUAL`;

const htmlApproved = (id) =>
  `<p>Hola,</p><p>Tu solicitud <b>${id}</b> fue <b>APROBADA</b>.</p>`;
const htmlRejected = (id, reason) =>
  `<p>Hola,</p><p>Tu solicitud <b>${id}</b> fue <b>RECHAZADA</b>.</p>${
    reason ? `<p>Motivo: ${reason}</p>` : ""
  }`;

const htmlManual = (id, reason, payload) =>
  [
    `<p>Hola,</p>`,
    `<p>Resultado de tu evaluación de capacidad para la solicitud <b>${id}</b>: <b>${payload.decision}</b>.</p>`,
    `<p>Capacidad Máxima: <b>${capacidadMaxima.toLocaleString()}</b>`,
    ` | Deuda Actual: <b>${deudaMensualActual.toLocaleString()}</b>`,
    ` | Capacidad Disponible: <b>${capacidadDisponible.toLocaleString()}</b>`,
    ` | Cuota estimada: <b>${cuotaNuevo.toLocaleString()}</b></p>`,
    reason ? `<p>Detalle: ${reason}</p>` : "",
    payload.schedule
      ? `<h3>Plan de pagos estimado</h3>
      <table border="1" cellpadding="4" cellspacing="0">
      <tr><th>Mes</th><th>Cuota</th><th>Interés</th><th>Abono Capital</th><th>Saldo</th></tr>
      ${printSchedule(payload.schedule)}</table>`
      : "",
  ].join("");

const textApproved = (id) => `Tu solicitud ${id} fue APROBADA.`;
const textRejected = (id, reason) =>
  `Tu solicitud ${id} fue RECHAZADA.${reason ? " Motivo: " + reason : ""}`;
const textManual = (id) => `Resultado de tu evaluación de Tu solicitud ${id}`;

const printSchedule = (schedule) => [
  ...schedule.map(
    (r) =>
      `<tr><td>${r.month}</td><td>${r.fee}</td><td>${r.interest}</td><td>${r.capitalPayment}</td><td>${r.finalBalance}</td></tr>`
  ),
];

module.exports = {
  subjApproved,
  subjRejected,
  subjManual,
  htmlApproved,
  htmlRejected,
  htmlManual,
  textApproved,
  textRejected,
  textManual,
};
