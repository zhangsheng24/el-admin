import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// global css
import './assets/styles/index.scss'

import router from './router'
import store from './store'

Vue.use(ElementUI);

import './assets/icons/index'


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
