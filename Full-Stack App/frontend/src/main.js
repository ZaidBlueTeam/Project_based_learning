import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import Posts from './views/Posts.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/posts', component: Posts },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
