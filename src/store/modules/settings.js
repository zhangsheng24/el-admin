import config from '@/config'
const {sidebarLogo,tagsView,fixedHeader}=config
const settings={
    namespaced: true,
    state:{
        sidebarLogo: sidebarLogo,
        tagsView:tagsView,
        fixedHeader:fixedHeader
    }
}

export default settings