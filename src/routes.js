import UserForm from '@/components/UserForm.vue'
import CardForm from '@/components/CardForm.vue'

export default [
  { path: '/', component: UserForm },
  { path: '/user', component: UserForm },
  { path: '/card', component: CardForm, meta: { transition: 'slide-left' } }
]
