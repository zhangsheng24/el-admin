
import {CgetItem,CsetItem} from '@/utils/storage'
const app={
    namespaced: true,
    state:{
        sidebar:{
            //cookie拿到的是字符串+'1'转成数字类型，
            //初始化状态，如果刷新浏览器之前是关闭sidebar，刷新浏览器之后还是关闭
            //注意：'0'?1:2得到的是1，'0'是true
            opened:CgetItem('sidebarStatus')? !!+CgetItem('sidebarStatus') : true
        }
    },
    mutations:{
        TOGGLE_SIDEBAR(state){
            state.sidebar.opened=!state.sidebar.opened
            if(state.sidebar.opened){
                CsetItem('sidebarStatus',1)
            }else{
                CsetItem('sidebarStatus',0)
            }
        }
    },
    actions:{
        toggleSideBar({ commit }) {
            commit('TOGGLE_SIDEBAR')
        },
    }
}

export default app