import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/golbal.css'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
import VQE from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VQE, /* { default global options } */ );
//配置请求的根路径
// axios.defaults.baseURL = 'http://42.192.40.14:8889/api/private/v1/';
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => { //config 请求对象  设置拦截器  让拿到token值的数据获取请求权限
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.component('t-t', treeTable)
Vue.filter('dateFormat', function(originValue) {
    const dt = new Date(originValue)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const h = (dt.getHours() + '').padStart(2, '0')
    const min = (dt.getMinutes() + '').padStart(2, '0')
    const s = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${min}:${s}`
})


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')