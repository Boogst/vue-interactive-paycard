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
                v-bind:value="$index.id"
                v-for="($index) in documents"
                v-bind:key="$index.id"
              >{{$index.type}}</option>
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
              maxlength="10"
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
      <button class="card-form__button" v-on:click="createUser">Create</button>
      <button class="card-form__button" v-on:click="readUser">Read</button>
    </div>
  </div>
</template>
<script>
import { docType } from '@/data/docType'
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
  async mounted () {
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
      console.log(docType)
    },
    readUser () {
      this.userData.userName = 'Camilo Andrés'
      this.userData.userLastN = 'Palacio Mier'
      this.userData.userDocType = '1'
      this.userData.userDocNum = '1002211875'
      this.userData.userPhone = '3107045996'
    }
  }
}
</script>
