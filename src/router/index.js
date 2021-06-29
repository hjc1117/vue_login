// 引入
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
Vue.use(VueRouter)
const routes = [{
    // 注册
    path: '/',
    redirect: '/login'
}, {
    path: "/login",
    component: Login
}, {
    path: "/home",
    component: Home
}]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next()
    } else {
        const token_ = window.sessionStorage.getItem('token')
        if (!token_) {
            return next('/login')
        } else {
            next()
        }
    }

})
export default router