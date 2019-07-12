<template>
  <v-layout class="ma-2 mt-5" text-xs-center align-start justify-center>
    <v-card v-if="usuario" class="elevation-6" max-width="250">
      <v-btn @click="editando = !editando" fab small color="secondary" absolute top right class="elevation-3">
        <v-fade-transition mode="out-in">
          <v-icon :key="1" v-if="!editando">edit</v-icon>
          <v-icon :key="2" v-else>close</v-icon>
        </v-fade-transition>
      </v-btn>
      <v-card-text>
        <v-layout justify-center>
          <v-btn @click="editarNombresApellidos" v-if="editando" flat icon small color="secondary">
            <v-icon>edit</v-icon>
          </v-btn>
          <div class="ma-2">
            {{ usuario.nombres + ' ' + usuario.apellidos }}
          </div>
        </v-layout>
        <v-img class="ma-2 fotoUsuario" :src="usuario.fotoPerfil" alt="Tu foto"></v-img>
        <v-layout justify-center>
          <v-btn @click="editarDescripcion" v-if="editando" flat icon small color="secondary">
            <v-icon>edit</v-icon>
          </v-btn>
          <div class="ma-2 descripcion">
            <span v-if="usuario.descripcion">{{ usuario.descripcion }}</span>
            <span v-else>Agrega una descripcion</span>
          </div>
        </v-layout>
        <v-layout justify-center>
          <div class="ma-2">
          <v-btn @click="editarBiografia" v-if="editando" flat icon small color="secondary">
            <v-icon>edit</v-icon>
          </v-btn>
            <a v-if="usuario.biografia" :href="usuario.biografia" target="_blank">Biografia</a>
            <span v-else>Ingresa tu biografia</span>
          </div>
        </v-layout>
      </v-card-text>
    </v-card>
    <!-- Editando Biografía -->
    <v-dialog v-model="editandoBiografia" max-width="400">
      <v-card>
        <v-toolbar color="primary" dark card>
          <v-toolbar-title>
            Ingresa tu biografía
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field v-model="edicionBiografia" label="Biografía"
                        autofocus
                        :error-messages="erroresBiografia"
                        @blur="$v.edicionBiografia.$touch()">
          </v-text-field>
        </v-card-text>
        <v-card-text>
          <v-layout justify-space-between>
            <v-btn @click="editandoBiografia = false" color="secondary">Cancelar</v-btn>
            <v-btn @click="guardarBiografia" :disabled="$v.edicionBiografia.$invalid" color="secondary">Guardar</v-btn>              
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Descripcion Editando -->
    <v-dialog v-model="editandoDescripcion" max-width="400">
      <v-card>
        <v-toolbar color="primary" dark card>
          <v-toolbar-title>
            Ingresa una descripción
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-textarea label="Agrega una descripción" v-model="edicionDescripcion" 
                      counter="300" autofocus
                      :error-messages="erroresDescripcion">

          </v-textarea>
        </v-card-text>
        <v-card-text>
          <v-layout justify-space-between>
            <v-btn @click="editandoDescripcion = false" color="secondary">Cancelar</v-btn>
            <v-btn @click="guardarDescripcion" :disabled="$v.edicionDescripcion.$invalid" color="secondary">Guardar</v-btn>              
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Nombre y Apellidos -->
    <v-dialog v-model="editandoNombresApellidos" max-width="400">
      <v-card>
        <v-toolbar color="primary" dark card>
          <v-toolbar-title>
            Ingresa tus nombres y apellidos
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field v-model="f2.nombres" label="Nombres"
                        autofocus
                        :error-messages="erroresNombres"
                        @blur="$v.f2.nombres.$touch()">
          </v-text-field>
          <v-text-field v-model="f2.apellidos" label="Apellidos"
                        :error-messages="erroresApellidos"
                        @blur="$v.f2.apellidos.$touch()">
          </v-text-field>
        </v-card-text>
        <v-card-text>
          <v-layout justify-space-between>
            <v-btn @click="editandoNombresApellidos = false" color="secondary">Cancelar</v-btn>
            <v-btn @click="guardarNombresApellidos" :disabled="$v.f2.$invalid" color="secondary">Guardar</v-btn>              
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { required, minLength, maxLength, url } from 'vuelidate/lib/validators'
import { nombreCompuesto } from '@/utilidades/validaciones.js'
import { mapState, mapMutations } from 'vuex'
import { db } from '@/firebase'

export default {
  data() {
    return {
      editando: false,
      editandoNombresApellidos: false,
      f2: {
        nombres: '',
        apellidos: ''
      },
      editandoDescripcion: false,
      edicionDescripcion: '',
      editandoBiografia: false,
      edicionBiografia: ''
    }
  },
  validations: {
    f2: {
      nombres: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
        nombreCompuesto
      },
      apellidos: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
        nombreCompuesto
      }
    },
    edicionDescripcion: {
      maxLength: maxLength(300)
    },
    edicionBiografia: {
      url
    }
  },
  methods: {
    ...mapMutations(['mostrarExito', 'mostrarError', 'mostrarOcupado', 'ocultarOcupado']),
    ...mapMutations('sesion', ['actualizarNombresApellidos', 'actualizarDescripcion', 'actualizarBiografia']),

    editarNombresApellidos() {
      this.f2.nombres = this.usuario.nombres
      this.f2.apellidos = this.usuario.apellidos
      this.editandoNombresApellidos = true
    },
    async guardarNombresApellidos() {
      if (this.f2.nombres == this.usuario.nombres && this.f2.apellidos == this.usuario.apellidos) {
        this.editandoNombresApellidos = false
        return
      }

      this.mostrarOcupado({ titulo: 'Actualizando información', mensaje: 'Estamos guardando los cambios.' })

      try {

        await db.collection('usuarios')
            .doc(this.usuario.uid)
            .update({ nombres: this.f2.nombres, apellidos: this.f2.apellidos})

        this.actualizarNombresApellidos({ nombres: this.f2.nombres, apellidos: this.f2.apellidos})

        this.editandoNombresApellidos = false
        this.editando = false

      } catch (error) {
        this.mostrarError('Ocurrió un error actualizando los datos.')
      }
      finally {
        this.ocultarOcupado()
      }
    },

    editarDescripcion() {
      this.edicionDescripcion = this.usuario.descripcion || ''
      this.editandoDescripcion = true
    },
    async guardarDescripcion() {
      if (this.edicionDescripcion == this.usuario.descripcion) {
        this.editandoDescripcion = false
        return
      }

      this.mostrarOcupado({ titulo: 'Actulizando información', mensaje: 'Estamos guardando los cambios.' })

      try {

        await db.collection('usuarios')
            .doc(this.usuario.uid)
            .update({ descripcion: this.edicionDescripcion })

        this.actualizarDescripcion(this.edicionDescripcion)
        this.editandoDescripcion = false
        this.editando = false
        
      } catch (error) {
        this.mostrarError('Ocurrió un error actualizando los datos.')
      }
      finally {
        this.ocultarOcupado()
      }
    },

    editarBiografia() {
      this.edicionBiografia = this.usuario.biografia || ''
      this.editandoBiografia = true
    },
    async guardarBiografia() {
      if (this.edicionBiografia == this.usuario.biografia) {
        this.editandoBiografia = false
        return
      }

      this.mostrarOcupado({ titulo: 'Actualizando información', mensaje: 'Estamos actualizando la biografía' })

      try {

        await db.collection('usuarios')
            .doc(this.usuario.uid)
            .update({ biografia: this.edicionBiografia })
        
        this.actualizarBiografia(this.edicionBiografia)

        this.editandoBiografia = false
        this.editandoBiografia = false

        this.mostrarExito('Se actualizo la biografia correctamente')
        
      } catch (error) {
        this.mostrarError('Ocurrió un error actualizando los datos.')
      }
      finally {
        this.ocultarOcupado()
      }
    }
  },
  computed: {
    // usuario() {
    //   return this.$store.state.sesion.usuario
    // }
  ...mapState('sesion', ['usuario']),
    erroresNombres() {
      let errores = []
      if (!this.$v.f2.nombres.$dirty) { return errores }
      if (!this.$v.f2.nombres.required) { errores.push('Ingresa tu nombre.')}
      if (!this.$v.f2.nombres.minLength) { errores.push('Ingresa al menos 3 caracteres')}
      if (!this.$v.f2.nombres.maxLength) { errores.push('Ingresa al máximo 20 caracteres')}
      if (!this.$v.f2.nombres.nombreCompuesto) { errores.push('Ingresa solo nombre valido')}
      return errores
    },
    erroresApellidos() {
      let errores = []
      if (!this.$v.f2.apellidos.$dirty) { return errores }
      if (!this.$v.f2.apellidos.required) { errores.push('Ingresa tus apellidos.')}
      if (!this.$v.f2.apellidos.minLength) { errores.push('Ingresa al menos 3 caracteres')}
      if (!this.$v.f2.apellidos.maxLength) { errores.push('Ingresa al máximo 20 caracteres')}
      if (!this.$v.f2.apellidos.nombreCompuesto) { errores.push('Ingresa un apellido valido')}
      return errores
    },
    erroresDescripcion() {
      let errores = []
      if (!this.$v.edicionDescripcion.$dirty) { return errores }
      if (!this.$v.edicionDescripcion.maxLength) { errores.push('Ingresa al máximo 300 caracteres')}
      return errores
    },
    erroresBiografia() {
      let errores = []
      if (!this.$v.edicionBiografia.$dirty) { return errores }
      if (!this.$v.edicionBiografia.url) { errores.push('Ingresa una Url válida')}
      return errores
    }
  },
}
</script>


<style>

.fotoUsuario {
  width: 200px;
  height: 100%;
}

.descripcion {
  text-align: justify;
}

</style>
