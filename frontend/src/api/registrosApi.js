// Cliente HTTP para el modelo Registro.
//
// IMPORTANTE: el backend todavía NO tiene un @RestController para Registro.
// Estas rutas siguen la convención REST que corresponde a los métodos de
// ServiciosRegistros (guardarRegistro, buscar, modificar, eliminar). Si el
// controlador que se cree usa otra ruta, solo hay que cambiar VITE_REGISTROS_API en .env.
//
//   GET    /api/registros        -> ServiciosRegistros.buscar()
//   POST   /api/registros        -> ServiciosRegistros.guardarRegistro(registro)
//   PUT    /api/registros/{id}   -> ServiciosRegistros.modificar(id, registro)
//   DELETE /api/registros/{id}   -> ServiciosRegistros.eliminar(id)
//
// Forma del JSON que devuelve Spring para Registro (según los getters del modelo;
// usuario y reto NO se serializan por @JsonBackReference):
//   { id, fechaRegistros: "YYYY-MM-DDTHH:mm:ss", observacion, estado }

const BASE = import.meta.env.VITE_REGISTROS_API || '/api/registros';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body.message || body.error || '';
    } catch {
      /* sin cuerpo JSON */
    }
    const err = new Error(detail || `Error ${res.status} al llamar ${url}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const registrosApi = {
  listar: () => request(BASE),
  crear: (registro) => request(BASE, { method: 'POST', body: JSON.stringify(registro) }),
  modificar: (id, registro) =>
    request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(registro) }),
  eliminar: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
};
