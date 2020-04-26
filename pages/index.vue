<template>
  <div class="container">
    <h1 class="title">次世代のTodoアプリ</h1>
    <ul>
      <li><nuxt-link to="/todo">Todo</nuxt-link></li>
      <li><nuxt-link to="/todo-old-generation">前時代のTodo</nuxt-link></li>
      <li><nuxt-link to="/todo-composition">新世代のTodo</nuxt-link></li>
      <li><nuxt-link to="/todo-graphql">GraphQLのTodo</nuxt-link></li>
    </ul>
  </div>
</template>

<style scoped>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {}
})
</script>
