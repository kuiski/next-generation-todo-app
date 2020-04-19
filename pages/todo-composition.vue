<template>
  <div>
    <label v-for="label in options" v-bind:key="label.value">
      <input type="radio" v-model="current" v-bind:value="label.value"/>{{
      label.label
      }}
    </label>
    <div>{{ computedTodos.length }} 件を表示中</div>

    <table>
      <!-- テーブルヘッダー -->
      <thead>
      <tr>
        <th class="id">ID</th>
        <th class="comment">コメント</th>
        <th class="state">状態</th>
        <th class="button">-</th>
      </tr>
      </thead>
      <tbody>
      <!-- [1] ここに <tr> で ToDo の要素を1行づつ繰り返し表示したい -->
      <tr v-for="item in computedTodos" v-bind:key="item.id">
        <th>{{ item.id }}</th>
        <td>{{ item.comment }}</td>
        <td class="state">
          <button v-on:click="doChangeState(item)">
            {{ labels[item.state] }}
          </button>
        </td>
        <td class="button">
          <button v-on:click="doRemove(item)">
            削除
          </button>
        </td>
        <!-- 要素の情報 -->
      </tr>
      </tbody>
    </table>
    <h2>新しい作業の追加</h2>
    <!-- コメント入力フォーム -->
    コメント
    <input type="text" v-model="inputComment"/>
    <button v-on:click="doAdd">追加</button>

  </div>
</template>

<style scoped></style>

<script lang="ts">
  import { defineComponent, ref, computed, watch, Ref } from '@vue/composition-api'
  import { Todo } from '~/types/todo'

  export default defineComponent({
    setup (_props: { }, context) {
      // define state
      const todos: Ref<Todo[]> = ref([])
      const options: Ref<{value: number, label: string}[]> = ref([
        { value: -1, label: 'すべて' },
        { value: 0, label: '作業中' },
        { value: 1, label: '完了' }
      ])
      const current: Ref<number> = ref(-1)
      const inputComment: Ref<string> = ref('')

      // define computed
      const labels = computed<object>(() => {
          // キーから見つけやすいように、次のように加工したデータを作成
          // {0: '作業中', 1: '完了', -1: 'すべて'}
          return options.value.reduce((a, b) => {
            return { ...a, [b.value]: b.label }
            //return Object.assign(a, { [b.value]: b.label })
          }, {})
      })

      const computedTodos = computed<Todo[]>(() => {
        return todos.value.filter((todo) => {
          return current.value < 0 ? true : current.value === todo.state
        })
      })

      // define methods
      const doAdd = (_event: Event) => {
        // ref で名前を付けておいた要素を参照
        // let comment = this.$refs.comment as any
        // 入力がなければ何もしないで return
        if (!inputComment.value.length) {
          return
        }
        // { 新しいID, コメント, 作業状態 }
        // というオブジェクトを現在の todos リストへ push
        // 作業状態「state」はデフォルト「作業中=0」で作成
        todos.value.push({
          id: todos.value.length,
          comment: inputComment.value,
          state: 0
        })
        // フォーム要素を空にする
        inputComment.value = ''
      }

      // 状態変更の処理
      const doChangeState = (item: Todo) => {
        item.state = item.state ? 0 : 1
      }

      // 削除の処理
      const doRemove = (item: Todo) => {
        const index = todos.value.indexOf(item)
        todos.value.splice(index, 1)
      }

      // define created
      todos.value = context.root.$localStorage.fetch()

      // define watch
      watch(todos, (todos) => {
          context.root.$localStorage.save(todos)
      })

      return {
        todos,
        options,
        current,
        inputComment,
        labels,
        computedTodos,
        doAdd,
        doChangeState,
        doRemove
      }
    }
  })
</script>
