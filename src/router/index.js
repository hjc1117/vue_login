// 引入
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import User from '../components/user/user.vue'
import Rights from '../components/power/rights.vue'
import Juese from '../components/power/juese.vue'
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
    component: Home,
    redirect: '/welcome',
    children: [{
        path: "/welcome",
        component: Welcome
    }, {
        path: "/users",
        component: User
    }, {
        path: "/rights",
        component: Rights
    }, {
        path: "/roles",
        component: Juese
    }, ]
}, ]

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