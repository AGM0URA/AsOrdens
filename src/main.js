import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fontsource-variable/inter'
import './assets/styles/global.css'

createApp(App).use(router).mount('#app')