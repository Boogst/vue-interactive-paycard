<template>
  <div>
    <header>
      <nav>
          <router-link to="/user">User</router-link>
          <router-link to="/card">Card</router-link>
        </nav>
    </header>
    <div class="wrapper" id="app">
      <transition
        name="fade"
        mode="out-in"
        enter-class="fade-enter"
        enter-active-class="fade-enter-active"
        leave-active-class="fade-leave-active"
      >
        <router-view >
        </router-view>
      </transition>
      <!-- backgroundImage="https://images.unsplash.com/photo-1572336183013-960c3e1a0b54?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
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
  }
}
</script>

<style lang="scss">
@import '../src/assets/style.scss';
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity .5s ease;
}

.fade-leave-active {
  transition: opacity .5s ease;
  opacity: 0;
}

ul {
  list-style-type: none;
  text-align: center;
  margin: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a{
  color: #fff;
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 10px;
}

nav{
  background: #444;
  padding: 14px 0;
}

.router-link-active{
  background: #eee;
  color: #444;
}
</style>
