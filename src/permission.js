import router from './router/index'
import {CgetItem} from '@/utils/storage'
import store from './store'


console.log(store.getters.roles)

// 白名单
const whiteList = ['/login']

router.beforeEach((to,from,next)=>{
    /**
     * http://localhost:8080/dev/manager/#/login?a=1
     * to.path='/login'
     * to.fullPath="/login?a=1"
     * to.query={a: "1"}
     */
    console.log(from)
    console.log(to)
    // token存在且未过期的情况下
    if(CgetItem('token')){
        // 已登录，token未过期，如果用户在地址栏输入登录地址，则让它跳转到首页
        if(to.path === '/login'){
            next({path:'/'})
        }else{// 地址栏不是登录/login
            if(store.getters.roles.length === 0){
                store.dispatch('GetInfo')
            }

        }

    }else{//没有token的情况下
        // 在免登录白名单中的path，可以直接进入，不需要验证token是否存在
        if(whiteList.indexOf(to.path) !== -1){
            next()
        }else{
            // 只要to也就是要访问的地址不在白名单当中，我们就让他重新跳转到登录页，并且收集此时地址的path
            next({path:`/login?redirect=${to.path}`})
        }
    }
})
router.afterEach(()=>{

})