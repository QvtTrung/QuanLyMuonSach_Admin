import './assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import "@fortawesome/fontawesome-free/css/all.min.css";
import router from './router';
import store from './store';

const app = createApp(App);
app.use(store); // Sử dụng store trong ứng dụng Vue
app.use(router)
app.mount('#app');