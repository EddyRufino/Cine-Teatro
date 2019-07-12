<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card class="elevation-6">
        <v-toolbar color="primary" dark card>
          <v-toolbar-title>
            Ingresa tus credenciales
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="subheading text-xs-center">
          Ingresa con:
        </v-card-text>
        <v-card-text>
          <v-layout justify-center>
            <a @click="ingresar('facebook')">
              <v-avatar tile>
                <img alt="Ingresa por Facebook" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M483.7 0H28.3C12.7 0 0 12.7 0 28.3v455.5C0 499.3 12.7 512 28.3 512h245.2V314H207v-77.5h66.5v-57c0-66.1 40.4-102.1 99.4-102.1 28.3 0 52.5 2.1 59.6 3v69.1h-40.7c-32.1 0-38.3 15.3-38.3 37.6v49.4h76.7l-10 77.5h-66.7v198h130.2c15.6 0 28.3-12.7 28.3-28.3V28.3C512 12.7 499.3 0 483.7 0z' fill='%234267b2'/><path d='M353.5 512V314h66.8l10-77.5h-76.8v-49.4c0-22.4 6.2-37.6 38.3-37.6h40.7V80.4c-7.1-.9-31.4-3-59.6-3-59 0-99.4 36-99.4 102.1v57H207V314h66.5v198h80z' fill='%23fff'/></svg>">
              </v-avatar>
            </a>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="subheading text-xs-center">
          Ingresa con cuenta de Email y contraseña
        </v-card-text>
        <v-card-text>
          <v-text-field label="email" v-model="formulario.email" 
                        :error-messages="erroresEmail"
                        autofocus
                        @blur="$v.formulario.email.$touch()"></v-text-field>
          <v-text-field label="password" type="password" v-model="formulario.password"
                        :error-messages="erroresPassword"
                        @blur="$v.formulario.password.$touch()"
                        @keyup.enter="ingresar('email')"></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-layout justify-end="">
            <v-btn @click="ingresar('email')" :disabled="$v.formulario.$invalid" color="secondary">Ingresar</v-btn>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="solicitudPassword = true" flat color="info">
              ¿Olvidades tu contraseña?</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn :to="{ name: 'registro'}" flat color="info">
              ¿No tienes una cuenta? Registrate</v-btn>
        </v-card-actions>
      </v-card>
      <v-dialog v-model="solicitudPassword" max-width="400" persistent>
        <v-card>
          <v-toolbar color="primary" dark card>
            <v-tollbar-title>
              Restrablecer contraseña
            </v-tollbar-title>
          </v-toolbar>
        <v-card-text class="subheading">
          Ingresa tu correo
        </v-card-text>
        <v-card-text class="subheading">
          <v-text-field label="Email" v-model="emailEnvio"
                        :error-messages="erroresEmailEnvio"
                        autofocus
                        @blur="$v.emailEnvio.$touch()">
            
          </v-text-field>
        </v-card-text>
        <v-card-text>
          <v-layout>
            <v-flex xs6>
              <v-layout justify-start>
                <v-btn @click="solicitudPassword = false">Cancelar</v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs6>
              <v-layout justify-end>
                <v-btn @click="enviarSolicitudPassword" :disabled="$v.emailEnvio.$invalid" color="primary">Cancelar</v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { firebase, auth } from '@/firebase'
import { mapMutations, mapGetters } from 'vuex'

//import { setTimeout } from 'timers';

export default {
  data() {
    return {
      formulario: {
        email: '',
        password: ''
      },
      solicitudPassword: false,
      emailEnvio: ''
    }
  },
  validations: {
    formulario: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      }
    },
    emailEnvio: {
      required,
      email
    }
  },
  methods: {
    ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'mostrarExito', 'mostrarAdvertencia']),
    ...mapMutations('sesion', ['actualizarUsuario']),
    //...mapMutations(['mostrarExito']),
    ingresar(metodo) {
      switch (metodo) {
        case 'email':
          this.ingresarEmail()
          break;
      
        case 'facebook':
          this.ingresarFacebook()
          break;
      }
    },

    async ingresarEmail() {
      if (this.$v.formulario.$invalid) {
        this.$v.formulario.$touch()
        return
      }

      let ocupado = {
        titulo: 'Validando credenciales',
        mensaje: 'Estamos validando tu información',
      }

      //this.$store.commit('mostrarOcupado', ocupado)
      this.mostrarOcupado(ocupado)

      try {
        await auth.signInWithEmailAndPassword(this.formulario.email, this.formulario.password)

        //this.$store.commit('mostrarExito', this.$store.getters.saludo)

      } catch (error) {

        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            this.mostrarAdvertencia('Usuario no valido, revisa tu correo y contraseña')
            break;
        
          default:
            this.mostrarError('Ocuarrió un error validando tu información')
            break;
        }
      }
      finally {
        this.ocultarOcupado()
      }
    },
    async ingresarFacebook() {
      let provider = new firebase.auth.FacebookAuthProvider()

      provider.setCustomParameters({
        'display': 'popup'
      })

      auth.languageCode = 'es_CO'

      try {
        await auth.signInWithPopup(provider)

        this.mostrarExito(this.saludo)
        this.$router.push({ name: 'home' })
      }
      catch(error) {
        this.mostrarError('Ocurrió un error validando tu correo.')
      }
    },
    async enviarSolicitudPassword() {
      this.solicitudPassword = false
      this.mostrarOcupado({ titulo: ' Enviando Solicutid', mensaje: 'Enviando solicitud para reestablecer contraseña.' })

      try {

        await auth.sendPasswordResetEmail(this.emailEnvio)
        this.mostrarExito('Se envio la solicitud con exito.')
        this.email= ''

      } catch (error) {
        this.mostrarError('Error al enviar solicitud.')
      }
      finally {
        this.ocultarOcupado()
      }
    }
  },
  computed: {
    ...mapGetters('sesion', ['saludo']),
    erroresEmail() {
      let errores = []
      if (!this.$v.formulario.email.$dirty) { return errores }
      if (!this.$v.formulario.email.required) { errores.push('Ingresa tu Email.')}
      if (!this.$v.formulario.email.email) { errores.push('Ingresa Email valido')}
      return errores
    },
    erroresPassword() {
      let errores = []
      if (!this.$v.formulario.password.$dirty) { return errores }
      if (!this.$v.formulario.password.required) { errores.push('Ingresa tu password.')}
      if (!this.$v.formulario.password.minLength) { errores.push('Ingresa al menos 6 caracteres')}
      if (!this.$v.formulario.password.maxLength) { errores.push('Ingresa al máximo 20 caracteres')}
      return errores
    },
    erroresEmailEnvio() {
      let errores = []
      if (!this.$v.emailEnvio.$dirty ) { return errores }
      if (!this.$v.emailEnvio.required) { errores.push('Ingresa tu Email.')}
      if (!this.$v.emailEnvio.email) { errores.push('Ingresa Email valido')}
      return errores
    }
  }
}
</script>
