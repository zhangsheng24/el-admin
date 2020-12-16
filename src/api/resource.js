import Login from './modules/login.js'
import menus from './modules/system/menu'
export default {
    ...Login,
    system:{
        ...menus  
    }
}