import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/golbal.css'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
//配置请求的根路径
axios.defaults.baseURL = 'http://42.192.40.14:8889/api/private/v1/'
    // axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => { //config 请求对象  设置拦截器  让拿到token值的数据获取请求权限
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.component('t-t', treeTable)


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')