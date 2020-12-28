import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//权限指令
import permission from './components/Permission/index'

// global css
import './assets/styles/index.scss'

import router from './router'
import store from './store'

Vue.use(ElementUI);
Vue.use(permission)

import './assets/icons/index'
import './permission'


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
