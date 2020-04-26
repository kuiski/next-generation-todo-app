<template>
  <div>
    <label v-for="label in options" v-bind:key="label.value">
      <input type="radio" v-model="current" v-bind:value="label.value" />{{
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
    <input type="text" v-model="inputComment" />
    <button v-on:click="doAdd">追加</button>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import Vue from 'vue'
import { Todo } from '~/types/todo'
import { useSourceMap } from '../composable/sourceMap'

interface DataType {
  todos: Todo[]
  options: { value: number; label: string }[]
  current: number
  inputComment: string
}

export default Vue.extend({
  layout: 'code', // new generation code
  setup() {
    // new generation function
    useSourceMap(['src/pages/todo.vue'])
  },
  data(): DataType {
    return {
      todos: [] as Todo[],
      options: [
        { value: -1, label: 'すべて' },
        { value: 0, label: '作業中' },
        { value: 1, label: '完了' }
      ],
      current: -1,
      inputComment: ''
    }
  },
  computed: {
    labels(): object {
      // キーから見つけやすいように、次のように加工したデータを作成
      // {0: '作業中', 1: '完了', -1: 'すべて'}
      return this.options.reduce((a, b) => {
        return { ...a, [b.value]: b.label }
        //return Object.assign(a, { [b.value]: b.label })
      }, {})
    },
    computedTodos(): Todo[] {
      // データ current が -1 ならすべて
      // それ以外なら current と state が一致するものだけに絞り込む
      // arrow functionのthisは実行時ではなく定義時のコンテキストで評価される
      return this.todos.filter((todo) => {
        return this.current < 0 ? true : this.current === todo.state
      })

      /*
        const self = this;
        return this.todos.filter(function (todo) {
          return self.current < 0 ? true : self.current = todo.state
        }) */
    }
  },
  methods: {
    // ToDo 追加の処理
    doAdd: function(_event: Event) {
      // ref で名前を付けておいた要素を参照
      // let comment = this.$refs.comment as any
      // 入力がなければ何もしないで return
      if (!this.inputComment.length) {
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: this.todos.length,
        comment: this.inputComment,
        state: 0
      })
      // フォーム要素を空にする
      this.inputComment = ''
    },
    // 状態変更の処理
    doChangeState: function(item: Todo) {
      item.state = item.state ? 0 : 1
    },
    // 削除の処理
    doRemove: function(item: Todo) {
      const index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }
  },
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      // 引数はウォッチしているプロパティの変更後の値
      handler: function(todos: Todo[]) {
        this.$localStorage.save(todos)
      },
      // deep オプションでネストしているデータも監視できる
      deep: true
    }
  },
  created() {
    // インスタンス作成時に自動的に fetch() する
    this.todos = this.$localStorage.fetch()
  }
})
</script>
