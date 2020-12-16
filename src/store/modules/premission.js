import constantRouterMap from '@/router/resource'
import Layout from '@/layout/index'

const premission={
    state:{
        routers:constantRouterMap,
        addRouters:[]
    },
    mutations:{
        SET_ROUTERS(state,routers){
            state.addRouters=routers
            state.routers=constantRouterMap.concat(routers)
        }
    },
    actions:{
        GenerateRoutee({commit},asyncRouter){
            commit('SET_ROUTERS',asyncRouter)
        }
    }
}


export const filterAsyncRouter = (routers) =>{
    // 便利后台传来的路由字符串，转换成组件对象
    return routers.filter(router=>{
        if(router.component){
            if(router.component === 'Layout'){
                router.component=Layout// layout组件特殊处理
            }else{
                const component=router.component
                router.component=loadView(component)
            }
        }
        //递归
        if(router.children && router.children.length){
            router.children=filterAsyncRouter(router.children)
        }
        return true
    })
}

export const loadView=(view)=>{
    return () => import(`@/views/${view}`)
}


export default premission