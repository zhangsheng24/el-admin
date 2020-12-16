import router from './router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'// progress bar style
import { CgetItem } from '@/utils/storage'
import store from './store'
import api from '@/api'
import { filterAsyncRouter } from '@/store/modules/permission'
import config from './config'

NProgress.configure({ showSpinner: false })// NProgress Configuration
// 白名单
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + ' - ' + config.title
      }
    NProgress.start()
    /**
     * http://localhost:8080/dev/manager/#/login?a=1
     * to.path='/login'
     * to.fullPath="/login?a=1"
     * to.query={a: "1"}
     */
    // token存在且未过期的情况下
    if (CgetItem('token')) {
        // 已登录，token未过期，如果用户在地址栏输入登录地址，则让它跳转到首页
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {// 地址栏不是登录/login
            // 执行这里：当刷新网页的时候，vuex的数据都会初始化，所以roles会清空
            if (store.getters.roles.length === 0) {
                store.dispatch('GetInfo').then(() => {
                    loadMenus(next, to)
                })
            } else if (store.getters.loadMenus) {//当在login页面点击登录的时候loadMenus会为true执行这里
                // 修改成false，防止死循环
                store.dispatch('updateLoadMenus')
                loadMenus(next, to)
            } else {
                next()
            }
        }

    } else {//没有token的情况下
        // 在免登录白名单中的path，可以直接进入，不需要验证token是否存在
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            // 只要to也就是要访问的地址不在白名单当中，我们就让他重新跳转到登录页，并且收集此时地址的path
            next({ path: `/login?redirect=${to.path}` })
            NProgress.done()
        }
    }
})

export const loadMenus = (next, to) => {
    // 获取服务器动态菜单
    api('system.menu.buildMenus').then(res => {
        //处理动态菜单
        const asyncRouter = filterAsyncRouter(res)
        // 给菜单再添加一个404，如果上面的路由地址没有匹配到就会到404页面,path: '*'代表任意路径
        asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
        // 存储路由,这一步是将所有的路由对象存在vuex中，
        // 首先，你需要明白 store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 store.dispatch 仍旧返回 Promise：
        // 所以在permission.js模块中，actions里面GenerateRoutes方法并没有返回一个promise，而这里可以用then的原因
        // 当然我们也可以在asyncRouter里面返回一个promise
        store.dispatch('GenerateRoutes', asyncRouter).then(() => { 
            console.log(store.getters.permission_routers)
            router.addRoutes(asyncRouter) // 动态添加可访问路由表，路由表里面就是所有的路由
            next({ ...to, replace: true })
        })
        // 这里我又存在一个误区，一直在纠结/system这个菜单对应的路由组件是layout是存在的，怎么还是会重定向到404。不应该显示layout组件吗
        // 实际上我没注意到redirect，一级菜单里面都有一个redirect代表重定向，当设置为'noredirect'的时候，访问地址/system会重定向/system/noredirect
        // 导致找不到这个路由地址，那么就会重定向到404
    })
}



router.afterEach(() => {
    NProgress.done()
})