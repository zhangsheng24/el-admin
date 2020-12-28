import store from '@/store'
/**
 * 自定义指令
 * 
 */
export default {
    inserted(el, binding, vnode) {
        //value就是指令绑定值
      const { value } = binding// 比如是用户管理，新增用户按钮，v-permission传递的是['admin','user:add']
      //roles['admin']
      const roles = store.getters && store.getters.roles
      if (value && value instanceof Array && value.length > 0) {
        const permissionRoles = value
        const hasPermission = roles.some(role => {// 返回布尔值
          return permissionRoles.includes(role)
        })
        // 如果传入的值没有在权限数组中，则找到当前元素的父元素，从父元素中删除这个子元素el
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        throw new Error(`使用方式： v-permission="['admin','editor']"`)
      }
    }
  }
  /**
   * 以上的权限roles用它来判断当前自定义指令的值是否满足权限条件是不可取的，正常应该是
   * 我们在获取导航菜单的时候后台就应该返回每个页面对应的按钮权限，然后我们在组装路由对象的时候
   * 就可以在当前路由对象中拿到权限，循环该权限，
   */