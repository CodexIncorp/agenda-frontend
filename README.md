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

La URL base del API se define **únicamente** en `/public/config.json`:

```json
{
    "API_URL": "https://equipo1.free.nf/api"
}
```

Para conectar el Front-End de este equipo con el Back-End de otro equipo, basta con **editar `config.json` y recargar el navegador**: no se recompila ni se modifica código fuente.

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

---

## Metodología de desarrollo

- Ramas por feature con **GitHub Flow** y merge `--no-ff` a `main`.
- Commits con **Conventional Commits** en español, imperativo. Cada commit compila y es autocontenido.

---

## Notas

- Durante el build aparece una advertencia benigna `INEFFECTIVE_DYNAMIC_IMPORT` por el import diferido del router en `http.js` (evita una dependencia circular). No afecta al funcionamiento.