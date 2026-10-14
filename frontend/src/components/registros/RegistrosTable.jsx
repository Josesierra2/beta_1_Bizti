import { useMemo, useState } from 'react';
import {
  antiguedad, badgeEstado, formatearFechaHora, normalizarEstado, parseFechaHora,
} from '../../utils/registros.js';

const COLUMNAS = [
  { key: 'observacion', label: 'Observación' },
  { key: 'estado', label: 'Estado' },
  { key: 'fechaRegistros', label: 'Fecha y hora' },
  { key: 'antiguedad', label: 'Antigüedad' },
];

function valorOrden(r, key) {
  switch (key) {
    // La antigüedad se ordena igual que la fecha (más reciente = menos antiguo)
    case 'antiguedad':
    case 'fechaRegistros': return parseFechaHora(r.fechaRegistros)?.getTime() ?? 0;
    case 'estado': return normalizarEstado(r.estado).toLowerCase();
    default: return (r[key] || '').toString().toLowerCase();
  }
}

export default function RegistrosTable({ registros, loading, onEditar, onEliminar }) {
  const [orden, setOrden] = useState({ key: 'fechaRegistros', dir: 'desc' });

  const filas = useMemo(() => {
    const copia = [...registros];
    copia.sort((a, b) => {
      const va = valorOrden(a, orden.key);
      const vb = valorOrden(b, orden.key);
      const c = va < vb ? -1 : va > vb ? 1 : 0;
      // "antiguedad" invierte el sentido: ascendente = del más reciente al más antiguo
      const signo = orden.key === 'antiguedad' ? -1 : 1;
      return (orden.dir === 'asc' ? c : -c) * signo;
    });
    return copia;
  }, [registros, orden]);

  const ordenarPor = (key) =>
    setOrden((o) => ({ key, dir: o.key === key && o.dir === 'asc' ? 'desc' : 'asc' }));

  if (loading) {
    return (
      <div className="bz-stack" style={{ gap: 8 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} className="bz-skeleton" style={{ height: 44 }} />)}
      </div>
    );
  }

  if (!filas.length) return <div className="bz-empty">No hay registros que coincidan con los filtros.</div>;

  return (
    <div className="bz-table-wrap">
      <table className="bz-table">
        <thead>
          <tr>
            {COLUMNAS.map((c) => (
              <th key={c.key}
                aria-sort={orden.key === c.key ? (orden.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button type="button" className="bz-th-sort" onClick={() => ordenarPor(c.key)}>
                  {c.label}
                  <span aria-hidden="true">{orden.key === c.key ? (orden.dir === 'asc' ? '↑' : '↓') : ''}</span>
                </button>
              </th>
            ))}
            <th><span className="bz-sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {filas.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="bz-cell-main" title={r.observacion || ''}>{r.observacion || 'Sin observación'}</div>
              </td>
              <td><span className={`bz-badge ${badgeEstado(r.estado)}`}>{normalizarEstado(r.estado)}</span></td>
              <td style={{ whiteSpace: 'nowrap' }}>{formatearFechaHora(r.fechaRegistros)}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{antiguedad(r.fechaRegistros)}</td>
              <td>
                <div className="bz-row" style={{ justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                  <button type="button" className="bz-btn bz-btn-ghost bz-btn-sm" onClick={() => onEditar(r)}>Editar</button>
                  <button type="button" className="bz-btn bz-btn-ghost bz-btn-sm" style={{ color: 'var(--bz-critical)' }}
                    onClick={() => onEliminar(r)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
