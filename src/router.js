import Vue from 'vue'
import Router from 'vue-router'
import { auth } from '@/firebase'

import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'

import AccionesEmail from './views/usuario/AccionesEmail.vue'
import EnvioVerificarEmail from './views/usuario/EnvioVerificarEmail.vue'
import Login from './views/usuario/Login.vue'
import Registro from './views/usuario/Registro.vue'
import Perfil from './views/usuario/Perfil.vue'

import Obra from './views/teatro/Obra.vue'
import Presentacion from './views/teatro/Presentacion.vue'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sesion/login',
      name: 'login',
      component: Login
    },
    {
      path: '/sesion/registro',
      name: 'registro',
      component: Registro
    },
    {
      path: '/sesion/envio-verificar-email',
      name: 'envio-verificar-email',
      component: EnvioVerificarEmail
    },
    {
      path: '/sesion/acciones-email',
      name: 'acciones-email',
      component: AccionesEmail
    },
    {
      path: '/usuario/perfil',
      name: 'perfil',
      component: Perfil,
      meta: {
        autenticado: true
      }
    },
    {
      path: '/obras/:oid',
      name: 'obra',
      component: Obra
    },
    {
      path: '/:oid/:tid/:fecha',
      name: 'presentacion',
      component: Presentacion
    },
    {
      path: '/404',
      name: '404',
      component: NotFound
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  let user = auth.currentUser

  if(to.matched.some(record => record.meta.autenticado)) {
    if(user) {
      if (user.providerData[0].providerId == 'password' && !user.emailVerified) {
        next({ name: 'envio-verificar-email' })
      } else {
        next()
      }
    }
    else {
      next({ name: 'login' })
    }
  }
  else {
    next()
  }
})

export default router