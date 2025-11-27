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
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'Posts',
  setup() {
    const posts = ref([])
    const newPost = ref({ title: '', content: '' })

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
        await axios.post('http://localhost:3000/posts', newPost.value)
        newPost.value = { title: '', content: '' }
        fetchPosts()
      } catch (err) {
        console.error(err)
      }
    }

    const deletePost = async (id) => {
      try {
        await axios.delete(`http://localhost:3000/posts/${id}`)
        fetchPosts()
      } catch (err) {
        console.error(err)
      }
    }

    const editPost = (post) => {
      // Simple edit, for demo
      const newTitle = prompt('New title', post.title)
      const newContent = prompt('New content', post.content)
      if (newTitle && newContent) {
        axios.put(`http://localhost:3000/posts/${post.id}`, { title: newTitle, content: newContent }).then(fetchPosts)
      }
    }

    onMounted(fetchPosts)

    return { posts, newPost, createPost, deletePost, editPost }
  }
}
</script>