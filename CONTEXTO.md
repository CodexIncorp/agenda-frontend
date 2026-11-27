# Contexto y estado del proyecto — Agenda de Contactos (Front-End)

> Documento de contexto para el equipo. Resume el objetivo del proyecto, el estado actual y todas las implementaciones realizadas hasta la fecha.

---

## 1. Objetivo general

Desarrollar una aplicación web **Full Stack** de gestión de contactos compuesta por tres componentes independientes:

| Componente    | Tecnología      |
|---------------|-----------------|
| Front-End     | Vue 3           |
| Back-End      | PHP             |
| Base de Datos | MySQL / MariaDB |

Este repositorio contiene **únicamente el Front-End**, desacoplado, que consume un Back-End PHP mediante **peticiones HTTP reales**. La arquitectura es **interoperable**: el Front-End de un equipo puede conectarse al Back-End de otro equipo modificando solo un archivo de configuración, sin recompilar.

---

## 2. Stack y decisiones técnicas

- **Vue 3** con Composition API y sintaxis `<script setup>`.
- **Vue Router** con `createWebHashHistory()` (compatible con GitHub Pages).
- **Pinia** para el estado y la persistencia del token.
- **Fetch API** nativa (cliente HTTP centralizado en `src/services/http.js`).
- **Vite** como bundler / dev server (`base: './'` para GitHub Pages).
- Autenticación por **token propietario** (no JWT, no sesiones PHP).
- Estilos **CSS propio mobile-first** (sin frameworks), con `touch-action: manipulation` y áreas táctiles ≥ 44×44.

---

## 3. Estado actual

✅ **Todas las etapas del plan están completadas.** El proyecto compila y ejecuta correctamente.

- `npm run build` → OK.
- `npm run dev` → levanta y sirve `config.json` correctamente.
- Árbol de trabajo limpio.
- `main` está **6 commits por delante de `origin/main`** (pendiente de `git push`).

> Advertencia benigna durante el build: `INEFFECTIVE_DYNAMIC_IMPORT` por el import diferido del router en `http.js` (evita dependencia circular). No afecta al funcionamiento.

---

## 4. Resumen de implementaciones por etapa

### Etapa 0 — Configuración base e interoperabilidad
- `public/config.json` con `API_URL` (placeholder editable).
- `src/config/api.js` → `getApiUrl()` lee `/config.json` y cachea la URL en memoria.
- `vite.config.js` con `base: './'`; `index.html` en español con título y favicon.

### Etapa 1 — Capa HTTP y servicios
- `src/services/http.js`: wrapper de `fetch` que inyecta `Authorization: Bearer`, serializa JSON (sin tocar `FormData`), parsea `{ success, message }` y redirige a `/login` ante `401/403`.
- `src/services/authService.js`: `login`, `registrar`, `perfil`, `editar`, `logout`.
- `src/services/contactosService.js`: `listar`, `detalle`, `crear`, `actualizar`, `eliminar`.

### Etapa 2 — Estado con Pinia
- `src/stores/auth.js`: `token`, `usuario`, persistencia en `localStorage`, getter `estaAutenticado` y acciones `login`, `logout`, `editar`, `cargarPerfil`.

### Etapa 3 — Enrutado y guards
- `src/router/index.js`: 7 rutas mínimas con hash history y guard de autenticación (redirige a `/login` si no hay sesión).

### Etapa 4 — Layout y componentes base
- `src/App.vue` (navbar + `<router-view>`), `src/main.js`.
- Componentes: `AppNavbar.vue`, `MensajeAlerta.vue`, `SpinnerCarga.vue`, `CampoFormulario.vue`.
- Estilos globales base en `src/assets/main.css`.

### Etapa 5 — Vistas de autenticación
- `HomeView.vue`: bienvenida con accesos según sesión.
- `LoginView.vue`: login con validación, spinner y feedback; redirige a `/agenda`.
- `RegistroView.vue`: registro con validación (contraseña ≥ 6 y confirmación); redirige a `/login`.

### Etapa 6 — Vistas de agenda (CRUD)
- `AgendaView.vue`: listado con foto (o inicial), datos y acciones; eliminación con confirmación en línea.
- `ContactoFormView.vue`: crear/editar según `:id`, subida de foto con `FormData`, validación y vista previa.

### Etapa 7 — Vista de perfil
- `PerfilView.vue`: ver/editar datos del usuario y cambio de foto (`FormData` si hay imagen, JSON si no).

### Etapa 8 — Estilos mobile-first (pulido)
- `:hover` solo en dispositivos con puntero y `:active` unificados; `:focus-visible`, botones deshabilitados, responsive (≥480px) y `prefers-reduced-motion`.

### Etapa 9 — Verificación y pulido final
- Build y dev verificados; `README.md` definitivo.

### Etapa 10 — Documentación preliminar
- Refactor inicial del `README.md` alineado a las especificaciones (posteriormente pulido en la Etapa 9).

---

## 5. Placeholders y conexión con el Back-End

El **único punto a configurar** para conectar el Back-End (propio o de otro equipo) es:

```
/public/config.json
```

```json
{
    "API_URL": "https://equipo1.free.nf/api"
}
```

- `API_URL` es un **placeholder**. Debe reemplazarse por la URL base real del Back-End (por ejemplo `https://otro-equipo.free.nf/api`).
- **No hay URLs del API hardcodeadas** en los componentes: todo pasa por `src/services/http.js`, que resuelve la URL desde `config.json`.
- Tras editar `config.json` basta con **recargar el navegador**: no se recompila ni se toca código fuente.

> Nota de UI: cuando un usuario o contacto no tiene foto, la interfaz muestra un marcador con la inicial (placeholder visual), no un placeholder de backend.

---

## 6. Próximos pasos (fuera del código)

1. `git push` a `origin/main` para publicar.
2. Desplegar el Front-End en **GitHub Pages**.
3. Configurar el Back-End en el hosting PHP y poner su URL real en `public/config.json`.
4. Probar la interoperabilidad conectando este Front-End al Back-End de otro equipo.