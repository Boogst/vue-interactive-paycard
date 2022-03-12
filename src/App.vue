<template>
  <div class="wrapper" id="app">
      <UserForm
        :user-data="userData"
        @input-user-name="updateUserName"
        @input-user-last-name="updateUserLastN"
        @input-user-doc-type="updateUserDocType"
        @input-user-doc-num="updateUserDocNum"
        @input-user-prhone="updateUserPhone"
      />
      <CardForm
        :form-data="formData"
        @input-card-number="updateCardNumber"
        @input-card-name="updateCardName"
        @input-card-month="updateCardMonth"
        @input-card-year="updateCardYear"
        @input-card-cvv="updateCardCvv"
      />
    <!-- backgroundImage="https://images.unsplash.com/photo-1572336183013-960c3e1a0b54?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" -->
  </div>
</template>

<script>
import CardForm from '@/components/CardForm'
import UserForm from './components/UserForm.vue'

export default {
  name: 'app',
  components: {
    CardForm,
    UserForm
  },
  data () {
    return {
      formData: {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: ''
      },
      userData: {
        userName: '',
        userLastN: '',
        userDocType: '',
        userDocNum: '',
        userPhone: ''
      }
    }
  },
  methods: {
    updateCardNumber (val) {
    },
    updateCardName (val) {
    },
    updateCardMonth (val) {
    },
    updateCardYear (val) {
    },
    updateCardCvv (val) {
    },
    updateUserName (val) {
    },
    updateUserLastN (val) {
    },
    updateUserDocType (val) {
    },
    updateUserDocNum (val) {
    },
    updateUserPhone (val) {
    }
  }/*,
  mounted () {
    this.$i18n.locale = navigator.language
  },  */
}
</script>

<style lang="scss">
@import '../src/assets/style.scss';
</style>
