import { createWebHashHistory, createRouter } from 'vue-router'
import HomePage from '../pages/index/index.vue'
const constantRoutes = [
    {
        path: '/',
        hidden: true,
        redirect: '/index',
    },
    {
        path: '/index',
        hidden: true,
        component: HomePage
    },
]

const router = createRouter({
    history: createWebHashHistory('/webgis-book/typhoon/'),
    routes: constantRoutes,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

export default router