import Vue from 'vue'
import Vuex from 'vuex'
// import getters from './getters'

Vue.use(Vuex)

//直接复制下面代码，就可以不用一个个模块去引入,modules就是一个对象，里面放着modules文件夹中所有的模块
const modulesFiles=require.context('./modules',true,/\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
  }, {})
  console.log(modules)
/**
 * modules={
 *  user:{...},
 * ...
 * }
 */

//除了 state 是分模块的，其他 mutations 和 actions 都不分模块，因此规划的时候要注意不要重名！
//所以可以直接通过this.$store.dispath('xxx')调用

const store = new Vuex.Store({
    modules,
    // getters
})
  
  export default store