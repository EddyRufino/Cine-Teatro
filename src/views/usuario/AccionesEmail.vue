<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card v-if="email" class="elevation-6">
        <v-toolbar color="primary" dark card>
          <v-toolbar-title>
            Nueva contraseña
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="subheding">
          Ingresa una nueva contraseña para {{ email }}
        </v-card-text>
        <v-card-text>
          <v-text-field v-model="formRegistro.password" label="password" type="password"
                        :error-messages="erroresPassword"
                        @blur="$v.formRegistro.password.$touch()">
          </v-text-field>
          <v-text-field v-model="formRegistro.repetirPassword" label="Repite password" type="password"
                        :error-messages="erroresRepetirPassword"
                        @blur="$v.formRegistro.repetirPassword.$touch()">
          </v-text-field>
        </v-card-text>
        <v-card-text>
          <v-layout justify-end>
            <v-btn @click="cambiarPassword" :disabled="$v.formRegistro.$invalid" color="secondary">Aceptar</v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import { auth } from '@/firebase'
import { mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {
      actionCode: '',
      email: '',
      formRegistro: {
        password: '',
        repetirPassword: ''
      }
    }
  },
  validations: {
    formRegistro: {
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      },
      repetirPassword: {
        sameAs: sameAs('password')
      }
    }
  },
  methods: {
    ...mapMutations(['mostrarExito', 'mostrarError', 'mostrarInformacion', 'mostrarOcupado', 'ocultarOcupado']),
    ...mapMutations('sesion', ['actualizarUsuario']),

    async validar() {
      let mode = this.$route.query.mode
      this.actionCode = this.$route.query.oobCode

      switch (mode) {
        case 'verifyEmail':
          this.mostrarOcupado({ titulo: 'Verificando código', mendaje: 'Validando el código de verificación' })

          try {

            await auth.applyActionCode(this.actionCode)
            this.mostrarExito('Email validado con éxito. Ingresa tu correo para ingresar.')
            this.$router.push({ name: 'login' })

          } catch (error) {
            this.mostrarError('No fue posible validar tu dirección de email.')
          }
          finally {
            this.ocultarOcupado()
          }
          break;
      
        default:
          break;

        case 'resetPassword':

          this.mostrarOcupado({ titulo: 'Verificando Código', mensaje: 'Validando código para restablecer contraseña.' })

          try {

            this.email = await auth.verifyPasswordResetCode(this.actionCode)
            this.mostrarInformacion('Ingresa una nueva contraseña para ' + this.email)
            
          } catch (error) {
            this.mostrarError('No fue posible leer el código para reestablecer la contraseña.')
          }
          finally {
            this.ocultarOcupado()
          }

          break;
      }
    },

    async cambiarPassword() {

      this.mostrarOcupado({ titulo: 'Estableciendo contraseña', mensaje: 'Cambiando contraseña' })

      try {

        await auth.confirmPasswordReset(this.actionCode, this.formRegistro.password)

        await auth.signInWithEmailAndPassword(this.email, this.formRegistro.password)

        //this.$store.commit('mostrarExito', this.$store.getters.saludo)
        //this.mostrarExito(this.saludo + )

        //this.$router.push({ name: 'home' })
        
      } catch (error) {
        this.mostrarError('No fue posible cambiar la contraseña')
      }
      finally {
        this.ocultarOcupado()
      }
    }
  },
  created() {
    this.validar()
  },
  computed: {

    ...mapGetters('sesion', ['saludo']),

    erroresPassword() {
      let errores = []
      if (!this.$v.formRegistro.password.$dirty) { return errores }
      if (!this.$v.formRegistro.password.required) { errores.push('Ingresa tu password.')}
      if (!this.$v.formRegistro.password.minLength) { errores.push('Ingresa al menos 6 caracteres')}
      if (!this.$v.formRegistro.password.maxLength) { errores.push('Ingresa al máximo 20 caracteres')}
      return errores
    },
    erroresRepetirPassword() {
      let errores = []
      if (!this.$v.formRegistro.repetirPassword.$dirty) { return errores }
      if (!this.$v.formRegistro.repetirPassword.sameAs) { errores.push('Las contraseñas no coinciden.')}
      return errores
    } 
  }
}
</script>
