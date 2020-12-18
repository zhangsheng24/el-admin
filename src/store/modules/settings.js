import config from '@/config'
const {sidebarLogo,tagsView}=config
const settings={
    namespaced: true,
    state:{
        sidebarLogo: sidebarLogo,
        tagsView:tagsView
    }
}

export default settings