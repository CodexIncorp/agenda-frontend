import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Fuente Inter autoalojada (sin CDN, funciona offline en GitHub Pages).
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

// Estilos globales: tokens → base → components.
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')