import { useEffect, useMemo, useState } from 'react';
import { useRegistros } from '../api/useRegistros.js';
import KpiCard from '../components/ui/KpiCard.jsx';
import BarList from '../components/ui/BarList.jsx';
import ColumnChart from '../components/ui/ColumnChart.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import RegistroForm from '../components/registros/RegistroForm.jsx';
import RegistrosTable from '../components/registros/RegistrosTable.jsx';
import {
  DIAS_RECIENTES, PERIODOS, antiguedad, contarPor, esDelMes, esReciente, formatearFechaHora,
  normalizarEstado, registrosPorMes, ultimoRegistro,
} from '../utils/registros.js';

export default function RegistrosDashboard() {
  const { registros, loading, error, demo, recargar, crear, modificar, eliminar } = useRegistros();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ---- Indicadores (sobre todos los registros) ----
  const kpis = useMemo(() => {
    const ultimo = ultimoRegistro(registros);
    return {
      total: registros.length,
      mes: registros.filter((r) => esDelMes(r)).length,
      mesAnterior: registros.filter((r) => esDelMes(r, undefined, 1)).length,
      recientes: registros.filter((r) => esReciente(r)).length,
      estados: new Set(registros.map((r) => normalizarEstado(r.estado))).size,
      ultimo,
    };
  }, [registros]);

  const estados = useMemo(() => contarPor(registros, (r) => normalizarEstado(r.estado)), [registros]);
  const porMes = useMemo(() => registrosPorMes(registros, 12), [registros]);

  // ---- Filtros de la tabla ----
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return registros.filter((r) => {
      if (filtroEstado && normalizarEstado(r.estado) !== filtroEstado) return false;
      if (filtroPeriodo && !PERIODOS[filtroPeriodo].test(r)) return false;
      if (q && !`${r.observacion || ''} ${r.estado || ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [registros, busqueda, filtroEstado, filtroPeriodo]);

  const hayFiltros = busqueda || filtroEstado || filtroPeriodo;

  // ---- Acciones ----
  const abrirNuevo = () => { setEditando(null); setFormAbierto(true); };
  const abrirEditar = (r) => { setEditando(r); setFormAbierto(true); };

  async function guardar(valores) {
    if (editando) {
      await modificar(editando.id, valores);
      setToast('Registro actualizado');
    } else {
      await crear(valores);
      setToast('Registro creado');
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminar(aEliminar.id);
      setToast('Registro eliminado');
      setAEliminar(null);
    } catch (e) {
      setToast(e.message || 'No se pudo eliminar');
    } finally {
      setEliminando(false);
    }
  }

  return (
    <main className="bz-page">
      <header className="bz-page-header">
        <div>
          <p className="bz-eyebrow">Bizti · Registros</p>
          <h1 className="bz-title">Dashboard de registros</h1>
          <p className="bz-subtitle">Seguimiento de la actividad registrada, sus estados y su evolución mensual.</p>
        </div>
        <div className="bz-row">
          <button type="button" className="bz-btn" onClick={recargar} disabled={loading}>Actualizar</button>
          <button type="button" className="bz-btn bz-btn-primary" onClick={abrirNuevo}>+ Nuevo registro</button>
        </div>
      </header>

      <div className="bz-stack">
        {demo && (
          <div className="bz-alert bz-alert-warning" role="status">
            <div>
              <strong>Modo demo: no se pudo conectar con el API de registros</strong>
              Se muestran datos de ejemplo y los cambios no se guardan.
              {error?.message ? ` (${error.message})` : ''} Verifica que el backend esté corriendo y que exista
              el controlador en <code>/api/registros</code>.
            </div>
          </div>
        )}

        <section className="bz-grid bz-grid-kpi" aria-label="Indicadores">
          <KpiCard label="Total de registros" value={kpis.total} tone="neutral" loading={loading}
            foot="Todos los registros cargados" />
          <KpiCard label="Registros del mes" value={kpis.mes} tone="info" loading={loading}
            foot={`Mes anterior: ${kpis.mesAnterior}`} />
          <KpiCard label="Últimos 7 días" value={kpis.recientes} tone="good" loading={loading}
            foot={`Actividad de los últimos ${DIAS_RECIENTES} días`} />
          <KpiCard label="Estados distintos" value={kpis.estados} tone="neutral" loading={loading}
            foot={estados[0] ? `Más frecuente: ${estados[0].label}` : 'Sin datos'} />
          <KpiCard label="Último registro" value={kpis.ultimo ? antiguedad(kpis.ultimo.fechaRegistros) : '—'}
            tone="info" loading={loading}
            foot={kpis.ultimo ? formatearFechaHora(kpis.ultimo.fechaRegistros) : 'Aún no hay registros'} />
        </section>

        <section className="bz-grid bz-grid-2">
          <div className="bz-card">
            <div className="bz-card-header">
              <h2 className="bz-card-title">Registros por estado</h2>
              <p className="bz-card-hint">Clic en una barra para filtrar</p>
            </div>
            {loading ? <div className="bz-skeleton" style={{ height: 160 }} /> : (
              <BarList data={estados} selected={filtroEstado} onSelect={setFiltroEstado} />
            )}
          </div>
          <div className="bz-card">
            <div className="bz-card-header">
              <h2 className="bz-card-title">Registros por mes</h2>
              <p className="bz-card-hint">Últimos 12 meses</p>
            </div>
            {loading ? <div className="bz-skeleton" style={{ height: 200 }} /> : (
              <ColumnChart data={porMes} unit=" registros" />
            )}
          </div>
        </section>

        <section className="bz-card">
          <div className="bz-card-header" style={{ flexWrap: 'wrap' }}>
            <h2 className="bz-card-title">
              Listado de registros{' '}
              <span style={{ color: 'var(--bz-text-muted)', fontWeight: 500 }}>
                ({filtrados.length}{filtrados.length !== registros.length ? ` de ${registros.length}` : ''})
              </span>
            </h2>
          </div>

          <div className="bz-row" style={{ marginBottom: 'var(--bz-space-4)' }}>
            <input className="bz-input" style={{ maxWidth: 280 }} type="search" placeholder="Buscar por observación o estado"
              aria-label="Buscar registro" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <select className="bz-select" style={{ maxWidth: 200 }} aria-label="Filtrar por estado"
              value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              {estados.map((e) => <option key={e.label} value={e.label}>{e.label}</option>)}
            </select>
            <select className="bz-select" style={{ maxWidth: 200 }} aria-label="Filtrar por periodo"
              value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
              <option value="">Todo el tiempo</option>
              {Object.entries(PERIODOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            {hayFiltros && (
              <button type="button" className="bz-btn bz-btn-ghost"
                onClick={() => { setBusqueda(''); setFiltroEstado(''); setFiltroPeriodo(''); }}>
                Limpiar filtros
              </button>
            )}
          </div>

          <RegistrosTable registros={filtrados} loading={loading} onEditar={abrirEditar} onEliminar={setAEliminar} />
        </section>
      </div>

      <RegistroForm
        open={formAbierto}
        registro={editando}
        estadosExistentes={estados.map((e) => e.label)}
        onClose={() => setFormAbierto(false)}
        onSubmit={guardar}
      />

      <ConfirmDialog
        open={Boolean(aEliminar)}
        title="Eliminar registro"
        message={aEliminar
          ? `¿Seguro que quieres eliminar el registro del ${formatearFechaHora(aEliminar.fechaRegistros)}? Esta acción no se puede deshacer.`
          : ''}
        busy={eliminando}
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />

      {toast && <div className="bz-toast" role="status">{toast}</div>}
    </main>
  );
}
