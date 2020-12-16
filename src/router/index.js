import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD
import {constantRouterMap} from './resource'
=======
import constantRouterMap from './resource'
>>>>>>> 15d072f09009c92cb6952034f1a5b784b5f7f54e
Vue.use(VueRouter)

const router=new VueRouter({
    routes:constantRouterMap
})

export default router

