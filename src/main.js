import Vue from 'vue'
import './plugins/vuetify'
import store from './store'
import router from './router'
import Vuelidate from 'vuelidate'
import { auth } from './firebase'
import App from './App.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(Vuelidate)

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch('sesion/iniciarSesion', user.uid)
  } 
  else {
    store.dispatch('sesion/cerrarSesion')
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
