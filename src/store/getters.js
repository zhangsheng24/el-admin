//模块内部的状态state，我们想想要在全局下访问必须通过state.模块名
const getters={
    roles:state => state.user.roles,
    loadMenus:state => state.user.loadMenus,
    permission_routers:state => state.permission.routers,
    sidebar:state => state.app.sidebar
}
export default getters