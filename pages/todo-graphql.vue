<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="error">
      {{ error.message }}
    </div>
    <div v-else-if="result && user.data.length > 0">
      <div>
        <i>{{ user.data[0].email }}</i
        >のToDo
      </div>
      <ul v-if="user.data[0].todos.data.length > 0">
        <li v-for="todo in user.data[0].todos.data">
          {{ todo.title }}
          <button @click="() => doDelete(todo._id)">削除</button>
        </li>
      </ul>
      <div v-else>
        No Todo
      </div>
      <h2>新しい作業の追加</h2>
      <!-- コメント入力フォーム -->
      コメント
      <input type="text" v-model="inputComment" />
      <button v-on:click="doAdd">追加</button>
    </div>
    <div v-else>
      User not found!
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  Ref
} from '@vue/composition-api'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useSourceMap } from '@/composable/sourceMap'

const GET_USER_TODOS = gql`
  query UserTodos($email: String!) {
    usersByEmail(email: $email) {
      data {
        _id
        email
        todos {
          data {
            _id
            title
            status
            completed
          }
        }
      }
    }
  }
`

const ADD_TODO = gql`
  mutation CreateTodo($userId: ID!, $title: String!) {
    createTodo(
      data: {
        title: $title
        status: "None"
        completed: false
        owner: { connect: $userId }
      }
    ) {
      _id
      title
      status
      completed
    }
  }
`

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      _id
    }
  }
`

export default defineComponent({
  layout: 'code',
  setup(_props, _context) {
    useSourceMap([
      '/src/plugins/apollo-client.ts',
      '/src/pages/todo-graphql.vue'
    ])

    const { result, loading, error } = useQuery(GET_USER_TODOS, {
      email: 'kuiski@example.com'
    })
    const user = useResult(result)
    const { mutate: addTodo } = useMutation(ADD_TODO, (): any => ({
      update: (cache, { data: { createTodo } }) => {
        const data = cache.readQuery({
          query: GET_USER_TODOS,
          variables: {
            email: 'kuiski@example.com'
          }
        })
        data.usersByEmail.data[0].todos.data.push(createTodo)
        cache.writeQuery({
          query: GET_USER_TODOS,
          variables: {
            email: 'kuiski@example.com'
          },
          data
        })
      }
    }))

    const { mutate: deleteTodo } = useMutation(DELETE_TODO, (): any => ({
      update: (cache, { data: { deleteTodo } }) => {
        const data = cache.readQuery({
          query: GET_USER_TODOS,
          variables: {
            email: 'kuiski@example.com'
          }
        })

        data.usersByEmail.data[0].todos.data = data.usersByEmail.data[0].todos.data.filter(
          (todo) => todo._id !== deleteTodo._id
        )
        cache.writeQuery({
          query: GET_USER_TODOS,
          variables: {
            email: 'kuiski@example.com'
          },
          data
        })
      }
    }))

    const inputComment: Ref<string> = ref('')

    const doAdd = () => {
      if (loading.value || !inputComment) return

      const userId = user.value.data[0]._id
      addTodo({
        userId,
        title: inputComment.value
      })
      inputComment.value = ''
    }

    const doDelete = (id: string) => {
      deleteTodo({
        id
      })
    }

    return {
      loading,
      error,
      result,
      user,
      inputComment,
      doAdd,
      doDelete
    }
  }
})
</script>
