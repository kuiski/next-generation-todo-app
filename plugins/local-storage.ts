import Vue from 'vue'
import {Todo} from '~/types/todo'

export interface TodoStorage {
  fetch: () => Todo[]
  save: (todos: Todo[]) => void
}

const VueLocalStorage = {
  install: (Vue: any, _options: any) => {
    const STORAGE_KEY = 'todos-vuejs-demo'
    const todoStorage: TodoStorage = {
      fetch: () => {
        const todos: Todo[] = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach((todo, index) => {
            todo.id = index
        })

        return todos
      },
      save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
      }
    }

    Vue.prototype.$localStorage = todoStorage
  }
}

Vue.use(VueLocalStorage)
