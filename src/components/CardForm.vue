<template>
  <div class="card-form">
    <div class="card-list">
      <Card
        :fields="fields"
        :labels="formData"
        :isCardNumberMasked="isCardNumberMasked"
        :randomBackgrounds="randomBackgrounds"
        :backgroundImage="backgroundImage"
      />
    </div>
    <div class="card-form__inner">
      <div class="card-input">
        <label for="cardNumber" class="card-input__label">{{ $t('cardForm.cardNumber') }}</label>
        <input
          type="tel"
          :id="fields.cardNumber"
          @input="changeNumber"
          @focus="focusCardNumber"
          @blur="blurCardNumber"
          class="card-input__input"
          :value="formData.cardNumber"
          :maxlength="cardNumberMaxLength"
          data-card-field
          autocomplete="off"
          v-required
        />
        <button
          class="card-input__eye"
          :class="{ '-active' : !isCardNumberMasked }"
          title="Show/Hide card number"
          tabindex="-1"
          :disabled="formData.cardNumber === ''"
          @click="toggleMask"
        ></button>
      </div>
      <div class="card-input">
        <label for="cardName" class="card-input__label">{{ $t('cardForm.cardName') }}</label>
        <select
              class="card-input__input -select"
              :id="fields.cardName"
              v-model="formData.cardName"
              @change="changeName"
              data-card-field
              v-required
            >
              <option value disabled selected>{{ $t('cardForm.cardName') }}</option>
              <option
                v-bind:value="$index.FS_NAME + ' ' + $index.FS_SURNAME"
                v-for="$index in users"
                v-bind:key="$index.ID"
              >{{$index.FS_NAME}} {{$index.FS_SURNAME}}</option>
            </select>

      </div>
      <div class="card-form__row">
        <div class="card-form__col">
          <div class="card-form__group">
            <label for="cardMonth" class="card-input__label">{{ $t('cardForm.expirationDate') }}</label>
            <select
              class="card-input__input -select"
              :id="fields.cardMonth"
              v-model="formData.cardMonth"
              @change="changeMonth"
              data-card-field
              v-required
            >
              <option value disabled selected>{{ $t('cardForm.month') }}</option>
              <option
                v-bind:value="n < 10 ? '0' + n : n"
                v-for="n in 12"
                v-bind:disabled="n < minCardMonth"
                v-bind:key="n"
              >{{generateMonthValue(n)}}</option>
            </select>
            <select
              class="card-input__input -select"
              :id="fields.cardYear"
              v-model="formData.cardYear"
              @change="changeYear"
              data-card-field
              v-required
            >
              <option value disabled selected>{{ $t('cardForm.year') }}</option>
              <option
                v-bind:value="$index + minCardYear"
                v-for="(n, $index) in 12"
                v-bind:key="n"
              >{{$index + minCardYear}}</option>
            </select>
          </div>
        </div>
        <div class="card-form__col -cvv">
          <div class="card-input">
            <label for="cardCvv" class="card-input__label">{{ $t('cardForm.CVV') }}</label>
            <input
              type="tel"
              class="card-input__input"
              v-number-only
              :id="fields.cardCvv"
              maxlength="4"
              :value=formData.cardCvv
              @input="changeCvv"
              data-card-field
              autocomplete="off"
              v-required
            />
          </div>
        </div>
      </div>
      <div class="card-form__row">
              <button class="card-form__button" v-on:click="createCard">Create</button>
              <button class="card-form__button" v-on:click="readCard">Read</button>
        </div>
        <div class="card-form__row">
              <button class="card-form__button" v-on:click="updateCard">Update</button>
              <button class="card-form__button" v-on:click="deleteCard">Delete</button>
        </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'
const headers = { 'Content-Type': 'application/json' }
export default {
  name: 'CardForm',
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
    },
    'required': {
      bind (el) {
        function checkValue (event) {
          if (event.target.value === '') {
            el.style.borderColor = 'red'
          } else {
            el.style.borderColor = null
          }
        }
        el.addEventListener('blur', checkValue)
        el.addEventListener('keyup', checkValue)
        el.addEventListener('focus', checkValue)
        el.addEventListener('change', checkValue)
      }
    }
  },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          cardName: '',
          cardNumber: '',
          cardNumberNotMask: '',
          cardMonth: '',
          cardYear: '',
          cardCvv: '',
          cardId: null
        }
      }
    },
    backgroundImage: [String, Object],
    randomBackgrounds: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Card
  },
  data () {
    return {
      fields: {
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardCvv: 'v-card-cvv'
      },
      minCardYear: new Date().getFullYear(),
      isCardNumberMasked: true,
      mainCardNumber: this.cardNumber,
      cardNumberMaxLength: 19,
      users: [],
      cardTypes: []
    }
  },
  computed: {
    minCardMonth () {
      if (this.formData.cardYear === this.minCardYear) return new Date().getMonth() + 1
      return 1
    }
  },
  watch: {
    cardYear () {
      if (this.formData.cardMonth < this.minCardMonth) {
        this.formData.cardMonth = ''
      }
    }
  },
  mounted () {
    this.maskCardNumber()
    fetch('http://52.200.169.154:8081/user/all', { headers })
      .then(res => res.json())
      .then(data => {
        const { result } = data
        this.users = result
      })
    fetch('http://52.200.169.154:8081/cards-type/all', { headers })
      .then(res => res.json())
      .then(data => {
        const { result } = data
        this.cardTypes = result
      })
  },
  methods: {
    generateMonthValue (n) {
      return n < 10 ? `0${n}` : n
    },
    changeName (e) {
      this.formData.cardName = e.target.value
      this.$emit('input-card-name', this.formData.cardName)
    },
    changeNumber (e) {
      this.formData.cardNumber = e.target.value
      let value = this.formData.cardNumber.replace(/\D/g, '')
      // american express, 15 digits
      if ((/^3[47]\d{0,13}$/).test(value)) {
        this.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 17
      } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
        this.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 16
      } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
        this.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        this.cardNumberMaxLength = 19
      }
      // eslint-disable-next-line eqeqeq
      if (e.inputType == 'deleteContentBackward') {
        let lastChar = this.formData.cardNumber.substring(this.formData.cardNumber.length, this.formData.cardNumber.length - 1)
        // eslint-disable-next-line eqeqeq
        if (lastChar == ' ') { this.formData.cardNumber = this.formData.cardNumber.substring(0, this.formData.cardNumber.length - 1) }
      }
      this.$emit('input-card-number', this.formData.cardNumber)
    },
    changeMonth () {
      this.$emit('input-card-month', this.formData.cardMonth)
    },
    changeYear () {
      this.$emit('input-card-year', this.formData.cardYear)
    },
    changeCvv (e) {
      this.formData.cardCvv = e.target.value
      this.$emit('input-card-cvv', this.formData.cardCvv)
    },
    invaildCard () {
      let number = this.formData.cardNumberNotMask.replace(/ /g, '')
      var sum = 0
      for (var i = 0; i < number.length; i++) {
        var intVal = parseInt(number.substr(i, 1))
        if (i % 2 === 0) {
          intVal *= 2
          if (intVal > 9) {
            intVal = 1 + (intVal % 10)
          }
        }
        sum += intVal
      }
      if (sum % 10 !== 0) {
        alert(this.$t('cardForm.invalidCardNumber'))
      }
    },
    blurCardNumber () {
      if (this.isCardNumberMasked) {
        this.maskCardNumber()
      }
    },
    maskCardNumber () {
      this.formData.cardNumberNotMask = this.formData.cardNumber
      this.mainCardNumber = this.formData.cardNumber
      let arr = this.formData.cardNumber.split('')
      arr.forEach((element, index) => {
        if (index > 4 && index < 14 && element.trim() !== '') {
          arr[index] = '*'
        }
      })
      this.formData.cardNumber = arr.join('')
    },
    unMaskCardNumber () {
      this.formData.cardNumber = this.mainCardNumber
    },
    focusCardNumber () {
      this.unMaskCardNumber()
    },
    toggleMask () {
      this.isCardNumberMasked = !this.isCardNumberMasked
      if (this.isCardNumberMasked) {
        this.maskCardNumber()
      } else {
        this.unMaskCardNumber()
      }
    },
    findUserId (fullName) {
      const user = this.users.find(el => `${el.FS_NAME} ${el.FS_SURNAME}` === fullName)
      return user
    },
    findUserById (id) {
      const user = this.users.find(el => Number(el.ID) === id)
      return user
    },
    cardType () {
      let number = this.formData.cardNumberNotMask.replaceAll(' ', '')
      let re = new RegExp('^4')
      if (number.match(re) != null) return 'Visa'

      re = new RegExp('^(34|37)')
      if (number.match(re) != null) return 'American Express'

      re = new RegExp('^5[1-5]')
      if (number.match(re) != null) return 'Mastercard'

      re = new RegExp('^6011')
      if (number.match(re) != null) return 'Discover'

      re = new RegExp('^62')
      if (number.match(re) != null) return 'Union Pay'

      re = new RegExp('^9792')
      if (number.match(re) != null) return 'Troy'

      re = new RegExp('^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}')
      if (number.match(re) != null) return 'Diners Club'

      re = new RegExp('^35(2[89]|[3-8])')
      if (number.match(re) != null) return 'JCB'

      return 'Visa' // default type
    },
    findCardTypeId (cardName) {
      return this.cardTypes.find(el => el.TYPE_NAME === cardName)
    },
    createCard () {
      const { cardName } = this.formData
      const customer = this.findUserId(cardName)
      const number = this.formData.cardNumberNotMask.replaceAll(' ', '')
      const cardType = this.findCardTypeId(this.cardType())
      const body = {
        cardNum: number,
        cardCvv: this.formData.cardCvv,
        cardExpDate: `${this.formData.cardMonth}/${this.formData.cardYear}`,
        cardCustomerId: customer.ID,
        cardTypeId: cardType.ID
      }
      fetch('http://52.200.169.154:8081/card/create', {
        headers,
        method: 'POST',
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then((data) => {
          const { result, status } = data
          if (status) {
            this.$toast('Tajeta Creada', {
              timeout: 2000,
              type: 'success',
              position: 'bottom-left'
            })
            this.formData.cardName = ''
            this.formData.cardNumber = ''
            this.formData.cardMonth = ''
            this.formData.cardYear = ''
            this.formData.cardCvv = ''
          } else {
            this.$toast(`Error: ${result}`, {
              timeout: 2000,
              type: 'error',
              position: 'bottom-left'
            })
          }
        })
        .catch(() => {
          this.$toast(`Error: Ocurrió un problema desconocido`, {
            timeout: 2000,
            type: 'error',
            position: 'bottom-left'
          })
        })
    },
    readCard () {
      const number = this.formData.cardNumberNotMask.replaceAll(' ', '')
      fetch(`http://52.200.169.154:8081/card/${number}`, { headers })
        .then(res => res.json())
        .then(data => {
          const { status, result } = data
          if (status) {
            const customer = this.findUserById(result.cardCustomerId)
            const date = result.cardExpDate.split('-')
            this.formData.cardName = `${customer.FS_NAME} ${customer.FS_SURNAME}`
            this.formData.cardCvv = result.cardCvv
            this.formData.cardYear = date[0]
            this.formData.cardMonth = date[1]
            this.formData.cardId = result.cardId
            this.$toast('Tarjeta encontrada', {
              timeout: 2000,
              type: 'success',
              position: 'bottom-left'
            })
          } else {
            this.$toast(`Error: ${result}`, {
              timeout: 2000,
              type: 'error',
              position: 'bottom-left'
            })
          }
        })
        .catch(() => {
          this.$toast(`Error: Ocurrió un problema desconocido`, {
            timeout: 2000,
            type: 'error',
            position: 'bottom-left'
          })
        })
    },
    updateCard () {
      const { cardId, ...rest } = this.formData
      const { cardName } = rest
      const customer = this.findUserId(cardName)
      const number = rest.cardNumberNotMask.replaceAll(' ', '')
      const cardType = this.findCardTypeId(this.cardType())
      const body = {
        cardNum: number,
        cardCvv: this.formData.cardCvv,
        cardExpDate: `${this.formData.cardMonth}/${this.formData.cardYear}`,
        cardCustomerId: customer.ID,
        cardTypeId: cardType.ID
      }
      const url = `http://52.200.169.154:8081/card/update/${cardId}`
      fetch(url, {
        headers,
        method: 'PATCH',
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then((data) => {
          const { status, message } = data
          if (status) {
            this.$toast('Tarjeta Modificado', {
              timeout: 2000,
              type: 'success',
              position: 'bottom-left'
            })
            this.formData.cardName = ''
            this.formData.cardMonth = ''
            this.formData.cardYear = ''
            this.formData.cardCvv = ''
          } else {
            this.$toast(`Error: ${message}`, {
              timeout: 2000,
              type: 'error',
              position: 'bottom-left'
            })
          }
        })
        .catch(() => {
          this.$toast(`Error: Ocurrió un problema desconocido`, {
            timeout: 2000,
            type: 'error',
            position: 'bottom-left'
          })
        })
    },
    deleteCard () {
      const num = this.formData.cardNumberNotMask.replaceAll(' ', '')
      if (window.confirm(`Estás segudo de que deseas eliminar la tarjeta: \n Numero de tarjeta: ${num}`)) {
        fetch(`http://52.200.169.154:8081/card/delete/${num}`, {
          headers,
          method: 'DELETE'
        })
          .then(res => res.json())
          .then((data) => {
            const { status, message } = data
            if (status) {
              this.$toast('Tarjeta Eliminada', {
                timeout: 2000,
                type: 'success',
                position: 'bottom-left'
              })
              this.formData.cardName = ''
              this.formData.cardMonth = ''
              this.formData.cardYear = ''
              this.formData.cardCvv = ''
            } else {
              this.$toast(`Error: ${message}`, {
                timeout: 2000,
                type: 'error',
                position: 'bottom-left'
              })
            }
          })
          .catch(() => {
            this.$toast(`Error: Ocurrió un problema desconocido`, {
              timeout: 2000,
              type: 'error',
              position: 'bottom-left'
            })
          })
      }
    }
  }
}
</script>
