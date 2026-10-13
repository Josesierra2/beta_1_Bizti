# Bizti · Frontend — Dashboard de Retos

Dashboard en **React + Vite** para el modelo **Reto** del proyecto `beta_1_Bizti`.

> **Alcance de esta entrega:** solo frontend. **No se modificó** nada del backend
> (`models`, `services`, `repository`). Todo vive en la carpeta `frontend/`.

---

## 1. Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| Node.js | 18 o superior | Correr el frontend |
| Java (JDK) | 17 o superior (probado con Corretto 21) | Correr el backend Spring Boot |

### Configurar `JAVA_HOME` (Windows)

Si al correr el backend sale *"The JAVA_HOME environment variable is not defined correctly"*:

```cmd
setx JAVA_HOME "C:\Users\<usuario>\.jdks\corretto-21.0.10"
```

Cierra y vuelve a abrir la terminal. Ajusta la ruta al JDK que tengas instalado.

---

## 2. Cómo correrlo

**Terminal 1 — backend (puerto 8080):**

```bash
cd beta_1_Bizti
./mvnw spring-boot:run        # en CMD: mvnw spring-boot:run
```

**Terminal 2 — frontend (puerto 5173):**

```bash
cd frontend
npm install
npm run dev
```

Abrir <http://localhost:5173>.

En desarrollo, Vite reenvía todo lo que empieza por `/api` a `http://localhost:8080`
(ver `vite.config.js`), así que **no hace falta configurar CORS** en el backend.
Para cambiar rutas o puerto, copiar `.env.example` como `.env`.

---

## 3. Qué muestra el dashboard

- **Indicadores:** total de retos, en curso, por vencer (≤ 7 días), vencidos y cerrados, y la duración promedio.
- **Retos por estado:** barras horizontales. Al hacer clic en una barra se filtra la tabla.
- **Retos iniciados por mes:** columnas de los últimos 12 meses, con tooltip.
- **Tabla:** búsqueda por nombre o descripción, filtros por estado y por situación, orden por columna.
- **CRUD:** crear, editar y eliminar retos (con confirmación).

### Reglas de negocio aplicadas en el frontend

- La **situación** de un reto no existe en el modelo; se calcula con las fechas y el estado:

  | Situación | Regla |
  |---|---|
  | Cerrado | El `estado` contiene finalizado, completado, cerrado, cancelado… |
  | Por iniciar | `fecha_inicio` es posterior a hoy |
  | Vencido | `fecha_fin` ya pasó y el reto no está cerrado |
  | Por vencer | Faltan 7 días o menos para `fecha_fin` |
  | En curso | El resto |

- **Editar** solo permite cambiar **nombre** y **descripción**, porque `ServiciosReto.modificar()` solo actualiza esos dos campos.
- Las validaciones del formulario siguen las anotaciones `@Column` del modelo: nombre obligatorio (máx. 50), descripción opcional (máx. 200), fechas obligatorias (fin ≥ inicio) y estado obligatorio (máx. 50).

---

## 4. API que consume

El dashboard espera estas rutas, que corresponden a los métodos de `ServiciosReto`:

| Método | Ruta | Servicio |
|---|---|---|
| GET | `/api/retos` | `ServiciosReto.buscar()` |
| POST | `/api/retos` | `ServiciosReto.guardaReto(reto)` |
| PUT | `/api/retos/{id}` | `ServiciosReto.modificar(id, reto)` |
| DELETE | `/api/retos/{id}` | `ServiciosReto.eliminar(id)` |

Formato JSON de un reto (según los getters del modelo; `empresa`, `categoria` y
`prioridad` no se serializan por `@JsonBackReference`):

```json
{
  "id": "uuid",
  "nombre": "texto",
  "descripcion": "texto o null",
  "fecha_inicio": "YYYY-MM-DD",
  "fecha_fin": "YYYY-MM-DD",
  "estado": "texto"
}
```

La ruta base se cambia con `VITE_RETOS_API` en `.env`, sin tocar código.

---

## 5. Modo demo (datos de ejemplo)

Si el API no responde, el dashboard entra en **modo demo**: muestra un aviso amarillo
arriba, carga 12 retos de ejemplo y los cambios no se guardan.

- Datos de ejemplo: `src/api/retosDemo.js`
- Dónde se activan: `src/api/useRetos.js`, en el `catch` de `cargar()`

**Para quitar el modo demo** cuando el API esté listo: borrar `retosDemo.js` y, en
`useRetos.js`, quitar el import y cambiar `setRetos(crearRetosDemo())` por `setRetos([])`.

---

## 6. Estado del backend (pendientes para conectar datos reales)

Hoy el dashboard funciona en **modo demo** porque:

1. **No existe un `@RestController` para Reto.** Spring arranca, pero `/api/retos` responde 404.
   Hay que crear `controllers/RetoController.java` con las rutas de la sección 4.
2. **El backend no compila:** `models/Registro.java` usa la clase `Usuario`, que no
   existe en el repositorio (ni en `develop` ni en `feature/cach`). Hay que subir el
   modelo `Usuario`.
3. **Para revisar:** en `Reto.java` la anotación es `@JsonBackReference("empresa_reto")`,
   pero en `Empresa.java` es `@JsonManagedReference("reto_empresa")`. Los nombres
   deben coincidir; si no, puede fallar la serialización a JSON.

Cuando 1 y 2 estén resueltos, el dashboard se conecta solo, sin cambios en el frontend.

---

## 7. Estructura

```
frontend/
├─ ESTILOS.md               Guía de estilos compartidos
├─ README.md                Este archivo
├─ .env.example             Variables de configuración
├─ vite.config.js           Proxy /api → backend
└─ src/
   ├─ main.jsx              Punto de entrada (importa el tema)
   ├─ App.jsx
   ├─ api/
   │  ├─ retosApi.js        Llamadas HTTP (GET, POST, PUT, DELETE)
   │  ├─ useRetos.js        Hook: carga, CRUD y modo demo
   │  └─ retosDemo.js       Datos de ejemplo
   ├─ components/
   │  ├─ ui/                Reutilizables: KpiCard, BarList, ColumnChart, Modal, ConfirmDialog
   │  └─ retos/             RetoForm.jsx, RetosTable.jsx
   ├─ pages/
   │  └─ RetosDashboard.jsx Página principal del dashboard
   ├─ styles/
   │  └─ bizti-theme.css    Tema compartido (colores, botones, tablas, modo oscuro)
   └─ utils/
      └─ retos.js           Cálculos de situación, fechas y agrupaciones
```

---

## 8. Estilos compartidos para el equipo

`src/styles/bizti-theme.css` tiene todo lo necesario para que los demás dashboards
(Empresa, Categoría, Prioridad, Registro) se vean igual: variables de color, espaciado,
botones, formularios, badges, tablas, modales, avisos y modo oscuro automático.

Los componentes de `src/components/ui/` se pueden reutilizar directamente.

Guía completa y plantilla para un dashboard nuevo: **[ESTILOS.md](./ESTILOS.md)**.
