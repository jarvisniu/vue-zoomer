import { createApp } from 'vue'
import VueZoomer from '../src/index.js'
import App from './App.vue'
import './index.css'

const app = createApp(App)
app.use(VueZoomer)
app.mount('#app')
