// 配置编译环境和线上环境之间的切换
const env = process.env

let config = {
    host: "",
    port: "",
    baseUrl: "",
    type: env.VUE_APP_TITLE,
}


if (config.type === 'development') {
    config.port = ''
    // config.baseUrl = '/api'
    config.host = 'https://el-admin.xin'
} else if (config.type === 'production') {
    config.port = ''
    // config.baseUrl = '/api'
    config.host = 'https://el-admin.xin'
} else if (config.type === 'test') {
    config.port = ''
    // config.baseUrl = '/api'
    config.host = 'https://el-admin.xin'
}
export default config