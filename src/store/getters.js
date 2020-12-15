//模块内部的状态state，我们想想要在全局下访问必须通过state.模块名
const getters={
    roles:state=>state.user.roles
}
export default getters