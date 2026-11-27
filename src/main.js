import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Estilos globales: tokens → base → components.
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')