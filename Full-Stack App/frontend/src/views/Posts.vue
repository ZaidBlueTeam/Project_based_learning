<template>
  <div>
    <h2>Posts</h2>
    <div v-if="posts.length">
      <div v-for="post in posts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <button @click="editPost(post)">Edit</button>
        <button @click="deletePost(post.id)">Delete</button>
      </div>
    </div>
    <form @submit.prevent="createPost">
      <input v-model="newPost.title" placeholder="Title" required />
      <textarea v-model="newPost.content" placeholder="Content"></textarea>
      <button type="submit">Create Post</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import io from 'socket.io-client'

export default {
  name: 'Posts',
  setup() {
    const posts = ref([])
    const newPost = ref({ title: '', content: '' })
    const socket = io('http://localhost:3000')

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts')
        posts.value = response.data
      } catch (err) {
        console.error(err)
      }
    }

    const createPost = async () => {
      try {
        socket.emit('createPost', newPost.value)
        newPost.value = { title: '', content: '' }
      } catch (err) {
        console.error(err)
      }
    }

    const deletePost = async (id) => {
      try {
        socket.emit('deletePost', { id })
      } catch (err) {
        console.error(err)
      }
    }

    const editPost = (post) => {
      const newTitle = prompt('New title', post.title)
      const newContent = prompt('New content', post.content)
      if (newTitle && newContent) {
        socket.emit('updatePost', { id: post.id, updateData: { title: newTitle, content: newContent } })
      }
    }

    onMounted(() => {
      fetchPosts()
      socket.on('postCreated', (post) => {
        posts.value.push(post)
      })
      socket.on('postUpdated', (updatedPost) => {
        const index = posts.value.findIndex(p => p.id === updatedPost.id)
        if (index !== -1) posts.value[index] = updatedPost
      })
      socket.on('postDeleted', (data) => {
        posts.value = posts.value.filter(p => p.id !== data.id)
      })
    })

    onUnmounted(() => {
      socket.disconnect()
    })

    return { posts, newPost, createPost, deletePost, editPost }
  }
}
</script>