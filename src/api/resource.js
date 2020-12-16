import Login from './modules/login.js'
import menu from './modules/system/menu'
export default {
    ...Login,
    system:{
        ...menu
    }
}