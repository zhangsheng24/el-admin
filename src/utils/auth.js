import Cookies from 'js-cookie'
import cfg from '@/config'

const TokenKey = cfg.TokenKey

const getToken = function () {
    return Cookies.get(TokenKey)
}

const setToken = function (token, rememberMe) {
    //如果选择记住我，那么就设置一个cookie有效时间，如果不设置，当关闭浏览器，存到cookie的数据全部清除
    if (rememberMe) {
        return Cookies.set(TokenKey, token, { expires: cfg.tokenCookieExpires })
    } else return Cookies.set(TokenKey, token)
}

const removeToken = function () {
    return Cookies.remove(TokenKey)
}

export {
    getToken,
    setToken,
    removeToken
}
