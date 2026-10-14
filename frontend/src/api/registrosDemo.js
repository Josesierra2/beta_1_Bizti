// Datos de ejemplo para ver el dashboard cuando el backend no responde.
// Las fechas se calculan desde ahora para que siempre haya registros de hoy,
// de la última semana y de varios meses atrás.
const dos = (n) => String(n).padStart(2, '0');

/** LocalDateTime local: "YYYY-MM-DDTHH:mm:ss", `dias` días atrás a la hora indicada. */
function fecha(dias, hora = 9, minuto = 0) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}T${dos(hora)}:${dos(minuto)}:00`;
}

let seq = 0;
const id = () => `demo-${String(++seq).padStart(4, '0')}-0000-0000-000000000000`;

export function crearRegistrosDemo() {
  seq = 0;
  return [
    { id: id(), fechaRegistros: fecha(0, 8, 15), observacion: 'Conteo inicial de bodega completado sin diferencias.', estado: 'Completado' },
    { id: id(), fechaRegistros: fecha(1, 15, 40), observacion: 'Se avanzó con el prototipo de la app de pedidos.', estado: 'En progreso' },
    { id: id(), fechaRegistros: fecha(2, 10, 5), observacion: 'Pendiente de validar los datos con el área comercial.', estado: 'Pendiente' },
    { id: id(), fechaRegistros: fecha(4, 17, 20), observacion: 'Reunión de seguimiento con el equipo de logística.', estado: 'En progreso' },
    { id: id(), fechaRegistros: fecha(6, 11, 30), observacion: 'Entrega parcial de indicadores de ventas por zona.', estado: 'Completado' },
    { id: id(), fechaRegistros: fecha(12, 9, 10), observacion: 'Se detectó una causa raíz en las devoluciones de producto.', estado: 'En revisión' },
    { id: id(), fechaRegistros: fecha(20, 14, 0), observacion: 'Encuesta de satisfacción enviada a 40 clientes.', estado: 'Completado' },
    { id: id(), fechaRegistros: fecha(33, 16, 45), observacion: 'La capacitación se pospuso por falta de sala.', estado: 'Cancelado' },
    { id: id(), fechaRegistros: fecha(47, 8, 50), observacion: 'Rutas de entrega optimizadas en la zona norte.', estado: 'Completado' },
    { id: id(), fechaRegistros: fecha(62, 13, 25), observacion: 'Chatbot de soporte en pruebas internas.', estado: 'En progreso' },
    { id: id(), fechaRegistros: fecha(80, 10, 0), observacion: 'Programa de reciclaje a la espera de aprobación.', estado: 'Pendiente' },
    { id: id(), fechaRegistros: fecha(105, 9, 35), observacion: 'Portal de proveedores publicado en producción.', estado: 'Completado' },
    { id: id(), fechaRegistros: fecha(140, 12, 10), observacion: 'Digitalización de actas de entrega terminada.', estado: 'Completado' },
    { id: id(), fechaRegistros: fecha(190, 15, 15), observacion: 'Ahorro de energía en planta: medición descartada.', estado: 'Cancelado' },
  ];
}
