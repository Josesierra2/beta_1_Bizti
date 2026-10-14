import { useEffect, useState } from 'react';
import Modal from '../ui/Modal.jsx';
import { MAX, aLocalDateTime, aValorInput } from '../../utils/registros.js';

const ESTADOS_SUGERIDOS = ['Pendiente', 'En progreso', 'En revisión', 'Completado', 'Cancelado'];

const vacio = () => ({ fechaRegistros: aValorInput(new Date()), observacion: '', estado: 'Pendiente' });

// Los límites (MAX) y los campos obligatorios vienen de las anotaciones @Column
// del modelo Registro: fecha_registro (not null), observacion (not null, 200),
// estado (not null, 50).
function validar(v, editando) {
  const e = {};
  if (!editando && !v.fechaRegistros) e.fechaRegistros = 'La fecha y hora del registro son obligatorias.';
  if (!v.observacion.trim()) e.observacion = 'La observación es obligatoria.';
  else if (v.observacion.length > MAX.observacion) e.observacion = `Máximo ${MAX.observacion} caracteres.`;
  if (!v.estado.trim()) e.estado = 'El estado es obligatorio.';
  else if (v.estado.length > MAX.estado) e.estado = `Máximo ${MAX.estado} caracteres.`;
  return e;
}

/**
 * Crear / editar registro.
 * Al editar solo se habilitan observación y estado, porque
 * ServiciosRegistros.modificar() únicamente actualiza esos dos campos.
 */
export default function RegistroForm({ open, registro, estadosExistentes = [], onClose, onSubmit }) {
  const editando = Boolean(registro);
  const [valores, setValores] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorApi, setErrorApi] = useState('');

  useEffect(() => {
    if (!open) return;
    setValores(registro ? {
      fechaRegistros: aValorInput(registro.fechaRegistros),
      observacion: registro.observacion || '',
      estado: registro.estado || '',
    } : vacio());
    setErrores({});
    setErrorApi('');
  }, [open, registro]);

  const set = (campo) => (e) => setValores((v) => ({ ...v, [campo]: e.target.value }));

  async function enviar(e) {
    e.preventDefault();
    const errs = validar(valores, editando);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    setEnviando(true);
    setErrorApi('');
    try {
      await onSubmit({
        fechaRegistros: aLocalDateTime(valores.fechaRegistros),
        observacion: valores.observacion.trim(),
        estado: valores.estado.trim(),
      });
      onClose();
    } catch (err) {
      setErrorApi(err.message || 'No se pudo guardar el registro.');
    } finally {
      setEnviando(false);
    }
  }

  const estados = [...new Set([...ESTADOS_SUGERIDOS, ...estadosExistentes])];

  return (
    <Modal
      open={open}
      title={editando ? 'Editar registro' : 'Nuevo registro'}
      onClose={enviando ? undefined : onClose}
      footer={(
        <>
          <button type="button" className="bz-btn" onClick={onClose} disabled={enviando}>Cancelar</button>
          <button type="submit" form="registro-form" className="bz-btn bz-btn-primary" disabled={enviando}>
            {enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear registro'}
          </button>
        </>
      )}
    >
      <form id="registro-form" className="bz-form-grid" onSubmit={enviar} noValidate>
        {errorApi && <div className="bz-alert bz-alert-critical bz-span-2" role="alert">{errorApi}</div>}

        <div className="bz-field bz-span-2">
          <label className="bz-label" htmlFor="registro-fecha">Fecha y hora del registro *</label>
          <input id="registro-fecha" type="datetime-local" className="bz-input" value={valores.fechaRegistros}
            onChange={set('fechaRegistros')} disabled={editando} aria-invalid={Boolean(errores.fechaRegistros)} />
          {errores.fechaRegistros && <span className="bz-error-text">{errores.fechaRegistros}</span>}
        </div>

        <div className="bz-field bz-span-2">
          <label className="bz-label" htmlFor="registro-estado">Estado *</label>
          <input id="registro-estado" className="bz-input" list="registro-estados" value={valores.estado}
            onChange={set('estado')} maxLength={MAX.estado} aria-invalid={Boolean(errores.estado)} />
          <datalist id="registro-estados">{estados.map((e) => <option key={e} value={e} />)}</datalist>
          {errores.estado ? <span className="bz-error-text">{errores.estado}</span>
            : <span className="bz-help">{valores.estado.length}/{MAX.estado}</span>}
        </div>

        <div className="bz-field bz-span-2">
          <label className="bz-label" htmlFor="registro-obs">Observación *</label>
          <textarea id="registro-obs" className="bz-textarea" value={valores.observacion} onChange={set('observacion')}
            maxLength={MAX.observacion} aria-invalid={Boolean(errores.observacion)} />
          {errores.observacion ? <span className="bz-error-text">{errores.observacion}</span>
            : <span className="bz-help">{valores.observacion.length}/{MAX.observacion}</span>}
        </div>

        <p className="bz-help bz-span-2" style={{ margin: 0 }}>
          {editando
            ? 'Por ahora el servicio de Registro solo permite modificar la observación y el estado; la fecha y hora no se puede cambiar.'
            : 'El usuario y el reto asociados no se pueden asignar desde aquí: el modelo los oculta del JSON (@JsonBackReference).'}
        </p>
      </form>
    </Modal>
  );
}
