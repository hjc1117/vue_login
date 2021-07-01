import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/golbal.css'
import axios from 'axios'

//配置请求的根路径
axios.defaults.baseURL = 'http://42.192.40.14:8889/api/private/v1/'
axios.interceptors.request.use(config => { //config 请求对象  设置拦截器  让拿到token值的数据获取请求权限
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')