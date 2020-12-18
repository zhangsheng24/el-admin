import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

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
  // console.log(modules)
/**
 * modules={
 *  user:{...},
 * ...
 * }
 */
//默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的
//除了 state 是分模块的，其他 mutations 和 actions 都不分模块，因此规划的时候要注意不要重名！
//所以可以直接通过this.$store.dispath('xxx')调用

//对于模块内部的 mutation，接收的第一个参数是模块的局部状态对象。
/**
 * const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment (state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  }
}
 */
//对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为context.rootState
/**
 * const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {//通过暴露出来的commit去执行模块内mutations的方法
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
 */

 //对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：
 /**
  * const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
  */

const store = new Vuex.Store({
    modules,
    getters
})
  
  export default store