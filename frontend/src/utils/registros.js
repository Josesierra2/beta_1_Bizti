// Utilidades puras para el dashboard de Registros (no dependen de React).
//
// El modelo Registro serializa (según sus getters):
//   { id, fechaRegistros: "YYYY-MM-DDTHH:mm:ss", observacion, estado }
// `usuario` y `reto` no llegan por @JsonBackReference.

const MS_DIA = 24 * 60 * 60 * 1000;
export const DIAS_RECIENTES = 7;

// Límites tomados de las anotaciones @Column del modelo Registro
export const MAX = { observacion: 200, estado: 50 };

const dosDigitos = (n) => String(n).padStart(2, '0');

/**
 * Convierte un LocalDateTime de Java a Date local (sin desfase de zona horaria).
 * Acepta "YYYY-MM-DDTHH:mm:ss(.SSS)" o el arreglo [y, m, d, h, mi, s] que
 * algunos Jackson devuelven cuando WRITE_DATES_AS_TIMESTAMPS está activo.
 */
export function parseFechaHora(valor) {
  if (!valor) return null;
  if (Array.isArray(valor)) {
    const [y, m, d, h = 0, mi = 0, s = 0] = valor;
    return new Date(y, m - 1, d, h, mi, s);
  }
  const coincide = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!coincide) return null;
  const [, y, m, d, h = 0, mi = 0, s = 0] = coincide.map((x, i) => (i === 0 ? x : x === undefined ? undefined : Number(x)));
  return new Date(y, m - 1, d, h, mi, s);
}

export function hoy() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function inicioDelDia(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

/** Días calendario entre dos fechas (b - a). */
export function diasEntre(a, b) {
  return Math.round((inicioDelDia(b) - inicioDelDia(a)) / MS_DIA);
}

const fmtFechaHora = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});
export function formatearFechaHora(valor) {
  const d = parseFechaHora(valor);
  return d ? fmtFechaHora.format(d).replace('.', '') : '—';
}

/** "Hoy", "Ayer", "Hace 5 días" o "En 2 días" (si la fecha es futura). */
export function antiguedad(valor, ref = new Date()) {
  const d = parseFechaHora(valor);
  if (!d) return '—';
  const dias = diasEntre(d, ref);
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Ayer';
  if (dias === -1) return 'Mañana';
  return dias > 0 ? `Hace ${dias} días` : `En ${Math.abs(dias)} días`;
}

/** "estado" es texto libre en el modelo; solo se normaliza para agrupar. */
export function normalizarEstado(estado) {
  const e = (estado || '').trim();
  if (!e) return 'Sin estado';
  return e.charAt(0).toUpperCase() + e.slice(1);
}

/** Badge para el texto de "estado" (el color siempre va acompañado de la palabra). */
export function badgeEstado(estado) {
  const e = (estado || '').toLowerCase();
  if (/cancel|rechaz|fall|error/.test(e)) return 'bz-badge-critical';
  if (/complet|finaliz|termin|cerrad|logrado|hecho|aprob/.test(e)) return 'bz-badge-good';
  if (/progreso|curso|activo|ejecu/.test(e)) return 'bz-badge-info';
  if (/revis|espera|pausa|pendiente/.test(e)) return 'bz-badge-warning';
  return 'bz-badge-neutral';
}

export function contarPor(lista, clave) {
  const mapa = new Map();
  for (const item of lista) {
    const k = clave(item);
    mapa.set(k, (mapa.get(k) || 0) + 1);
  }
  return [...mapa.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

const fmtMes = new Intl.DateTimeFormat('es-CO', { month: 'short' });

/** Registros creados en cada uno de los últimos N meses (incluye meses en 0). */
export function registrosPorMes(registros, meses = 12, ref = hoy()) {
  const buckets = [];
  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    const corto = fmtMes.format(d).replace('.', '');
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: corto + (d.getMonth() === 0 || i === meses - 1 ? ` ${String(d.getFullYear()).slice(2)}` : ''),
      titulo: `${corto} ${d.getFullYear()}`,
      value: 0,
    });
  }
  const idx = new Map(buckets.map((b, i) => [b.key, i]));
  for (const r of registros) {
    const d = parseFechaHora(r.fechaRegistros);
    if (!d) continue;
    const i = idx.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (i !== undefined) buckets[i].value += 1;
  }
  return buckets;
}

export function esDelMes(registro, ref = hoy(), mesesAtras = 0) {
  const d = parseFechaHora(registro.fechaRegistros);
  if (!d) return false;
  const objetivo = new Date(ref.getFullYear(), ref.getMonth() - mesesAtras, 1);
  return d.getFullYear() === objetivo.getFullYear() && d.getMonth() === objetivo.getMonth();
}

/** Registros de los últimos N días (incluyendo hoy). */
export function esReciente(registro, dias = DIAS_RECIENTES, ref = hoy()) {
  const d = parseFechaHora(registro.fechaRegistros);
  if (!d) return false;
  const diff = diasEntre(d, ref);
  return diff >= 0 && diff < dias;
}

export function ultimoRegistro(registros) {
  let ultimo = null;
  let t = -Infinity;
  for (const r of registros) {
    const d = parseFechaHora(r.fechaRegistros);
    if (d && d.getTime() > t) { t = d.getTime(); ultimo = r; }
  }
  return ultimo;
}

export const PERIODOS = {
  hoy: { label: 'Hoy', test: (r) => esReciente(r, 1) },
  semana: { label: `Últimos ${DIAS_RECIENTES} días`, test: (r) => esReciente(r, DIAS_RECIENTES) },
  mes: { label: 'Este mes', test: (r) => esDelMes(r) },
};

// ---- Conversión entre <input type="datetime-local"> y LocalDateTime ----

/** Date -> "YYYY-MM-DDTHH:mm" (formato del input datetime-local, hora local). */
export function aValorInput(valor) {
  const d = valor instanceof Date ? valor : parseFechaHora(valor);
  if (!d) return '';
  return `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}T${dosDigitos(d.getHours())}:${dosDigitos(d.getMinutes())}`;
}

/** "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DDTHH:mm:00" (LocalDateTime sin zona horaria). */
export function aLocalDateTime(valorInput) {
  if (!valorInput) return null;
  return valorInput.length === 16 ? `${valorInput}:00` : valorInput;
}
