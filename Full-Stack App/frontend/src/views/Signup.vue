<template>
  <div>
    <h2>Signup</h2>
    <form @submit.prevent="signup">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="passwordConfirm" type="password" placeholder="Confirm Password" required />
      <button type="submit">Signup</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: 'Signup',
  setup() {
    const email = ref('')
    const password = ref('')
    const passwordConfirm = ref('')
    const error = ref('')
    const router = useRouter()

    const signup = async () => {
      try {
        await axios.post('http://localhost:3000/auth/signup', { email: email.value, password: password.value, passwordConfirm: passwordConfirm.value })
        router.push('/login')
      } catch (err) {
        error.value = err.response.data.message
      }
    }

    return { email, password, passwordConfirm, error, signup }
  }
}
</script>