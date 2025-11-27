<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()

    const login = async () => {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', { email: email.value, password: password.value })
        localStorage.setItem('token', response.data.token)
        router.push('/posts')
      } catch (err) {
        error.value = err.response.data.message
      }
    }

    return { email, password, error, login }
  }
}
</script>