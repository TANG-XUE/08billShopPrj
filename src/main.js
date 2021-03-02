import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/styles/global.css'
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

//全局过滤器
Vue.filter('dateFormat',function (originVal) {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  const momth = (dt.getMonth()+1+'').padStart(2,'0')
  const date = (dt.getDate()+'').padStart(2,'0')

  const hours = (dt.getHours()+'').padStart(2,'0')
  const mim = (dt.getMinutes()+'').padStart(2,'0')
  const seconds = (dt.getSeconds()+'').padStart(2,'0')

  return `${year}-${momth}-${date} ${hours}:${mim}:${seconds}`
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
