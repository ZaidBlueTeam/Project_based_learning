<template>
  <div>
    <h1>Welcome to Full-Stack App</h1>
    <router-link to="/login">Login</router-link> |
    <router-link to="/signup">Signup</router-link> |
    <router-link to="/posts">Posts</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>