import Login from './modules/login.js'
import menu from './modules/system/menu'
import dept from './modules/system/dept'
import user from './modules/system/user'
export default {
    ...Login,
    system:{
        ...menu,
        ...dept,
        ...user
    }
}