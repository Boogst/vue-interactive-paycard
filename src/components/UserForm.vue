<template>
    <div class="card-form-user">
      <div class="card-list" style="padding-left: 23%">
        <img src="../assets/images/perfil2.png" width="70%">
      </div>
      <div class="card-form-user__inner">
      <div class="card-input">
        <label for="cardName" class="card-input__label">Nombres</label>
        <input
          type="text"
          :id="fields.userName"
          @input="changeName"
          class="card-input__input"
          :value="userData.userName"
          v-letter-only
          autocomplete="off"
        />
      </div>
      <div class="card-input">
        <label for="cardNumber" class="card-input__label">Apellidos</label>
        <input
          type="text"
          :id="fields.userLastN"
          @input="changeLastN"
          class="card-input__input"
          :value="userData.userLastN"
          v-letter-only
          autocomplete="off"
        />
      </div>
      <div class="card-form__row">
        <div class="card-form__col">
          <div class="card-form__group">
            <label for="userDocType" class="card-input__label">Tipo</label>
            <select
              class="card-input__input -select"
              :id="fields.userDocType"
              v-model="userData.userDocType"
              @change="changeDocType"
            >
              <option value disabled selected>Tipo</option>
              <option
                v-bind:value="$index.ID"
                v-for="($index) in documents"
                v-bind:key="$index.ID"
              >{{$index.ABBR}}</option>
            </select>
          </div>
        </div>
        <div class="card-form__col">
          <div class="card-input">
            <label for="cardCvv" class="card-input__label">Número de documento</label>
            <input
              type="tel"
              class="card-input__input"
              v-number-only
              @input="changeDocNumber"
              :id="fields.userDocNum"
              :value="userData.userDocNum"
              maxlength="15"
              autocomplete="off"
            />
          </div>
        </div>
      </div>
      <div class="card-input">
        <label for="cardNumber" class="card-input__label">Telefono</label>
        <input
          type="tel"
          class="card-input__input"
          v-number-only
          @input="changePhone"
          :id="fields.userPhone"
          :value="userData.userPhone"
          autocomplete="off"
        />
      </div>
      <div class="card-form__row">
          <button class="card-form__button" v-on:click="createUser">Create</button>
          <button class="card-form__button" v-on:click="readUser">Read</button>
      </div>
      <div class="card-form__row">
          <button class="card-form__button" v-on:click="createUser">Update</button>
          <button class="card-form__button" v-on:click="readUser">Delete</button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
Vue.use(Toast)
const headers = { 'Content-Type': 'application/json' }
export default {
  name: 'UserForm',
  directives: {
    'number-only': {
      bind (el) {
        function checkValue (event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, '')
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true
          }
          event.preventDefault()
        }
        el.addEventListener('keypress', checkValue)
      }
    },
    'letter-only': {
      bind (el) {
        function checkValue (event) {
          if (event.charCode >= 48 && event.charCode <= 57) {
            event.preventDefault()
          }
          return true
        }
        el.addEventListener('keypress', checkValue)
      }
    }
  },
  props: {
    userData: {
      default: () => {
        return {
          userName: '',
          userLastN: '',
          userDocType: '',
          userDocNum: '',
          userPhone: ''
        }
      }
    },
    initialForm: {
      default: () => {
        return {
          userName: '',
          userLastN: '',
          userDocType: '',
          userDocNum: '',
          userPhone: ''
        }
      }
    }
  },
  data () {
    return {
      fields: {
        userName: 'v-user-name',
        userLastN: 'v-user-last-name',
        userDocType: 'v-user-doc-type',
        userDocNum: 'v-user-doc-number',
        userPhone: 'v-user-phone'
      },
      documents: []

    }
  },
  mounted () {
    const headers = { 'Content-Type': 'application/json' }
    fetch('http://52.200.169.154:8081/documents-type/all', { headers })
      .then(res => res.json())
      .then(data => { this.documents = data })
      .catch(() =>
        this.$toast('Ha ocurrido un error', {
          timeout: 2000,
          type: 'error',
          position: 'bottom-left'
        }))
  },
  methods: {
    changeName (e) {
      this.userData.userName = e.target.value
      this.$emit('input-user-name', this.userData.userName)
    },
    changeLastN (e) {
      this.userData.userLastN = e.target.value
      this.$emit('input-user-last-name', this.userData.userLastN)
    },
    changeDocType () {
      this.$emit('input-user-doc-type', this.userData.userDocType)
    },
    changeDocNumber (e) {
      this.userData.userDocNum = e.target.value
      this.$emit('input-user-doc-number', this.userData.userDocNum)
    },
    changePhone (e) {
      this.userData.userPhone = e.target.value
      this.$emit('input-user-phone', this.userData.userPhone)
    },
    createUser () {
      fetch('http://52.200.169.154:8081/user/create', {
        headers,
        method: 'POST',
        body: JSON.stringify(this.userData)
      })
        .then(() => {
          this.$toast('Usuario Creado', {
            timeout: 2000,
            type: 'success',
            position: 'bottom-left'
          })
          this.userData.userName = ''
          this.userData.userLastN = ''
          this.userData.userDocType = ''
          this.userData.userDocNum = ''
          this.userData.userPhone = ''
        })
    },
    readUser () {
      const url = `http://52.200.169.154:8081/user/${this.userData.userDocNum}`
      fetch(url, { headers })
        .then((result) => {
          return result.json()
        })
        .then(data => {
          const { result } = data
          this.userData.userName = result.fs_name
          this.userData.userLastN = result.fs_surname
          this.userData.userDocType = result.doc_type
          this.userData.userDocNum = result.doc_num
          this.userData.userPhone = result.phone
          this.$toast('Usuario Encontrado', {
            timeout: 2000,
            type: 'success',
            position: 'bottom-left'
          })
        })
        .catch(() => {
          this.$toast('Ha ocurrido un problema', {
            timeout: 2000,
            type: 'error',
            position: 'bottom-left'
          })
        })
    }
  }
}
</script>
