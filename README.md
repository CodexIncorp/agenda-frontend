# Agenda de Contactos — Front-End

Aplicación web **Full Stack** de gestión de contactos. Este repositorio contiene el **Front-End desacoplado**, desarrollado con **Vue 3**, que consume un **Back-End PHP** mediante peticiones HTTP reales.

> El Front-End es **interoperable**: para conectarlo al Back-End de otro equipo basta con editar `public/config.json` y recargar el navegador, sin recompilar ni modificar código fuente.

---

## Tecnologías

- **Vue 3** (Composition API, sintaxis `<script setup>`)
- **Vue Router** (hash history, compatible con GitHub Pages)
- **Pinia** (estado y persistencia del token)
- **Fetch API** nativa para peticiones HTTP
- **Vite** (build / servidor de desarrollo)

---

## Requisitos

- Node.js `^22.18.0 || >=24.12.0`
- npm

---

## Instalación y uso

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # build de producción (carpeta dist/)
npm run preview  # previsualizar el build
```

---

## Estructura del proyecto

```
/public
  /config.json          # Único lugar donde se define la URL del API
/src
  /assets               # Estilos globales mobile-first (main.css)
  /components           # Componentes reutilizables
    AppNavbar.vue       # Barra de navegación
    CampoFormulario.vue # Campo label + input con v-model
    MensajeAlerta.vue   # Alertas de éxito / error / info
    SpinnerCarga.vue    # Indicador de carga
  /config
    /api.js             # Lectura dinámica de /public/config.json (con caché)
  /router
    /index.js           # Vue Router (Hash History) + guard de autenticación
  /services
    http.js             # Cliente HTTP centralizado (token, JSON, FormData, 401/403)
    authService.js      # Endpoints de autenticación
    contactosService.js # Endpoints de contactos
  /stores
    /auth.js            # Pinia store: token y datos del usuario
  /views                # Componentes de página
  App.vue
  main.js
```

---

## Configuración del API (interoperabilidad)

La URL base del API se define **únicamente** en `/public/config.json`. Es el
**único punto de conexión** entre el Front-End y el Back-End:

```json
{
    "API_URL": "https://TU-BACKEND.com/api"
}
```

> Para conectar otro backend (propio o de otro equipo) basta con **editar este
> archivo y recargar el navegador**. No se recompila ni se modifica código.

### Dónde se conecta la API

| Elemento | Ubicación | Qué hacer |
|----------|-----------|-----------|
| `API_URL` | `/public/config.json` | Reemplazar el valor por la URL base real del Back-End. |
| Lógica de lectura | `src/config/api.js` | Lee `config.json` una vez y lo cachea (no editar). |
| Cliente HTTP | `src/services/http.js` | Añade token, serializa JSON y maneja 401/403 (no editar). |

- **No hay URLs hardcodeadas** en los componentes: todo pasa por `http.js`.
- La URL debe incluir la ruta base `/api` **sin barra final** (ej. `https://servidor.com/api`).
- Tras guardar `config.json`, **recargar el navegador** es suficiente.

### Indicaciones para el Back-End

Para que este Front-End funcione contra un Back-End, éste debe cumplir el contrato:

1. **CORS habilitado** para el origen del Front-End:
   - `Access-Control-Allow-Origin` con el origen de la app (o `*` en desarrollo).
   - Métodos permitidos: `GET`, `POST`, `OPTIONS`.
   - Cabeceras permitidas: `Authorization`, `Content-Type`.
   - Responder correctamente a `OPTIONS` (preflight).
2. **Autenticación por token propietario** (no JWT, no sesiones PHP):
   - El login devuelve `{ success, token, usuario }`.
   - Las peticiones protegidas esperan `Authorization: Bearer <TOKEN>`.
3. **Formato de respuesta JSON**: `{ "success": true|false, "message": "..." }`.
4. **Endpoints exactos** (rutas y nombres no modificables): ver tabla en
   "Endpoints consumidos".
5. **Subida de imágenes** en `multipart/form-data` (JPG, PNG, WEBP).

---

## Autenticación

- Token propietario (no JWT, no sesiones PHP).
- El token se guarda en Pinia y se persiste en `localStorage`.
- Las peticiones protegidas envían `Authorization: Bearer <TOKEN>`.
- Ante `401`/`403` se cierra la sesión y se redirige a `/login`.

---

## Funcionalidades

- **Autenticación:** inicio de sesión y registro con validación en el Front-End.
- **Contactos (CRUD):** listado, creación, edición y eliminación, con confirmación en línea al eliminar.
- **Perfil:** consulta y edición de datos del usuario y cambio de foto.
- **Imágenes:** subida de foto de usuario y de contacto con `multipart/form-data` (JPG, PNG, WEBP). El `Content-Type` lo fija el navegador; no se establece manualmente.
- **Feedback:** spinner durante las peticiones y mensajes de éxito/error en todas las operaciones.

---

## Endpoints consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login.php` | Iniciar sesión |
| POST | `/auth/registrar.php` | Registrar usuario |
| GET  | `/auth/perfil.php` | Obtener perfil |
| POST | `/auth/editar.php` | Editar perfil |
| POST | `/auth/logout.php` | Cerrar sesión |
| GET  | `/contactos/index.php` | Listar contactos |
| GET  | `/contactos/detalle.php?id=` | Obtener contacto |
| POST | `/contactos/crear.php` | Crear contacto |
| POST | `/contactos/actualizar.php` | Actualizar contacto |
| POST | `/contactos/eliminar.php` | Eliminar contacto |

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/login` | Inicio de sesión |
| `/registro` | Registro de usuario |
| `/agenda` | Lista de contactos |
| `/agenda/crear` | Crear contacto |
| `/agenda/:id` | Editar contacto |
| `/perfil` | Perfil del usuario |

Las rutas privadas están protegidas por un guard que redirige a `/login` si no hay sesión.

---

## Publicación

- **Front-End:** GitHub Pages (hash history + `base: './'` en `vite.config.js`).
- **Back-End:** hosting PHP.
- **Repositorios:** GitHub (Front-End y Back-End por separado).

### Despliegue en GitHub Pages

El despliegue es automático mediante **GitHub Actions** (`.github/workflows/deploy.yml`), que se dispara en cada **push a `main`**: instala dependencias, compila y publica la carpeta `dist/`.

Pasos para activarlo:

1. Subir el código a la rama `main`.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Al hacer push a `main`, el workflow compila y publica; la URL queda en **Settings → Pages**.

Notas de interoperabilidad:

- La URL del API se configura en `public/config.json` (`API_URL`). Debe apuntar al Back-End real (propio o de otro equipo) y recargar el navegador.
- El Back-End debe permitir **CORS** desde el origen de GitHub Pages (cabecera `Access-Control-Allow-Origin`, métodos `GET/POST` y cabecera `Authorization`), incluyendo la respuesta a `OPTIONS` (preflight).
- `config.json` se carga de forma relativa a la base (`import.meta.env.BASE_URL`), por lo que funciona tanto en la raíz del dominio como en la subruta de GitHub Pages.

---

## Metodología de desarrollo

- Ramas por feature con **GitHub Flow** y merge `--no-ff` a `main`.
- Commits con **Conventional Commits** en español, imperativo. Cada commit compila y es autocontenido.

---

## Notas

- Durante el build aparece una advertencia benigna `INEFFECTIVE_DYNAMIC_IMPORT` por el import diferido del router en `http.js` (evita una dependencia circular). No afecta al funcionamiento.