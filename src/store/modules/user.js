import {
    CgetItem,
    CsetItem,
    CreItem
} from '@/utils/storage'
import api from '@/api'
import config from '@/config'

const user = {
    state: {
        token: CgetItem('token'),
        user: {},
        roles: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_USER: (state, user) => {
            state.user = user
        },
    },
    //Action 提交的是 mutation，而不是直接变更状态。
    //Action 可以包含任意异步操作。
    //对于模块内部的 action，局部状态通过 context.state 暴露出来,局部状态就是state
    actions: {
        //登录
        Login({ commit }, userInfo) {
            const rememberMe = userInfo.rememberMe
            return new Promise((resolve, reject) => {
                api('login.webLogin', userInfo).then(res => {
                    // 记住我就给个过期时间，不记住关闭浏览器失效
                    rememberMe?CsetItem('token',res.token,{expires: config.passCookieExpires}):CsetItem('token',res.token)
                    commit('SET_TOKEN', res.token)//登录成功之后给vuex中的模块user中的state里面的token设置一个最新的
                    resolve()
                }).catch(err=>{
                    reject(err)
                })
            })
        }
    }
}

// export const logOut = (commit) => {

// }

// export const setUserInfo = (res, commit) => {
//     //如果没有任何权限，则赋予一个默认的权限，避免请求死循环
//     if (res.roles.length === 0) {
//         commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])//设置默认权限
//     } else {
//         commit('SET_ROLES', res.roles)//设置当前用户权限
//     }
//     commit('SET_USER', res.user)//设置用户信息
// }

export default user
