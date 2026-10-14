import { useCallback, useEffect, useState } from 'react';
import { registrosApi } from './registrosApi.js';
import { crearRegistrosDemo } from './registrosDemo.js';

/**
 * Carga y CRUD de registros. Si el API no responde, activa el modo demo
 * (datos de ejemplo en memoria) para poder ver y probar el dashboard.
 */
export function useRegistros() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demo, setDemo] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await registrosApi.listar();
      setRegistros(Array.isArray(data) ? data : []);
      setDemo(false);
    } catch (e) {
      setError(e);
      setRegistros(crearRegistrosDemo());
      setDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const crear = useCallback(async (registro) => {
    if (demo) {
      const nuevo = { ...registro, id: `demo-${Date.now()}` };
      setRegistros((rs) => [nuevo, ...rs]);
      return nuevo;
    }
    const creado = await registrosApi.crear(registro);
    setRegistros((rs) => [creado, ...rs]);
    return creado;
  }, [demo]);

  const modificar = useCallback(async (id, registro) => {
    if (demo) {
      // Igual que ServiciosRegistros.modificar: solo cambia observación y estado
      setRegistros((rs) => rs.map((r) => (
        r.id === id ? { ...r, observacion: registro.observacion, estado: registro.estado } : r
      )));
      return;
    }
    const actualizado = await registrosApi.modificar(id, registro);
    setRegistros((rs) => rs.map((r) => (r.id === id ? { ...r, ...actualizado } : r)));
  }, [demo]);

  const eliminar = useCallback(async (id) => {
    if (!demo) await registrosApi.eliminar(id);
    setRegistros((rs) => rs.filter((r) => r.id !== id));
  }, [demo]);

  return { registros, loading, error, demo, recargar: cargar, crear, modificar, eliminar };
}
