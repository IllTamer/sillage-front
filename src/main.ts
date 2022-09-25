import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import $ from 'jquery'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(router)
    .use($)
    .use(ElementPlus)
    .mount('#app');
        