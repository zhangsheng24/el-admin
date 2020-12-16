import Vue from 'vue'
import VueRouter from 'vue-router'
import constantRouterMap from './resource'
Vue.use(VueRouter)

const router=new VueRouter({
    routes:constantRouterMap
})

export default router

