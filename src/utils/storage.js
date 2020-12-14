import Cookies from 'js-cookie'
import cfg from '@/config'

const name = `el-admin-${cfg.type}-`


/**
 * localStorage
 */

function LgetItem(key) {
  let value = localStorage.getItem(name + key)
  return JSON.parse(value)
}

function LsetItem(key, value) {
  localStorage.setItem(name + key, JSON.stringify(value))
}

function LreItem(key) {
  localStorage.removeItem(name + key)
}

/**
 * sessionStorage
 */
function SgetItem(key) {
  let value = sessionStorage.getItem(name + key);
  return JSON.parse(value)
}

function SsetItem(key, value) {
  sessionStorage.setItem(name + key, JSON.stringify(value))
}

function SreItem(key) {
  sessionStorage.removeItem(name + key)
}

/**
 * cookie
 * js-cookie为cookie提供了简洁的JSON存储。
 * 创建Cookie时，您可以传递数组或对象文字，而不是值中的字符串。
 * 如果这样做，js-cookie将根据以下内容存储对象的字符串表示形式JSON.stringify
 * 
 * 
 * 使用Cookies.getJSONapi读取Cookie时，您会收到根据以下内容解析的存储在Cookie中的字符串的表示形式JSON.parse
 * 
 * 如果取的值并不是一个json字符串，正常使用JSON.parse('admin')的时候会报错，这里用js-cookie不会出现问题
 */


const CgetItem = function (key) {
    return Cookies.getJSON(name + key)
}

const CsetItem = function (key, value,other = {}) {
    Cookies.set(name + key, value,other)
    //如果选择记住我，那么就设置一个cookie有效时间，如果不设置，当关闭浏览器，存到cookie的数据全部清除
    
}

const CreItem = function (key) {
    Cookies.remove(name + key)
}


export {
  LgetItem,
  LsetItem,
  LreItem,
  SgetItem,
  SsetItem,
  SreItem,
  CgetItem,
  CsetItem,
  CreItem
}

