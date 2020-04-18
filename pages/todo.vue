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
            <button v-on:click.ctrl="doRemove(item)">
              削除
            </button>
          </td>
          <!-- 要素の情報 -->
        </tr>
      </tbody>
    </table>
    <h2>新しい作業の追加</h2>
    <form class="add-form" v-on:submit.prevent="doAdd">
      <!-- コメント入力フォーム -->
      コメント
      <input type="text" ref="comment" />
      <button type="submit">追加</button>
    </form>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import Vue from 'vue'
import { Todo } from '~/types/todo'

export default Vue.extend({
  //   el: '#app',
  data: function() {
    return {
      todos: [] as Todo[],
      options: [
        { value: -1, label: 'すべて' },
        { value: 0, label: '作業中' },
        { value: 1, label: '完了' }
      ],
      // 選択している options の value を記憶するためのデータ
      // 初期値を「-1」つまり「すべて」にする
      current: -1
    }
  },
  computed: {
    labels() {
      return (this as any).options.reduce((a: any, b: any) => {
        return Object.assign(a, { [b.value]: b.label })
      }, {})
      // キーから見つけやすいように、次のように加工したデータを作成
      // {0: '作業中', 1: '完了', -1: 'すべて'}
    },
    computedTodos: function() {
      // データ current が -1 ならすべて
      // それ以外なら current と state が一致するものだけに絞り込む
      const self = this
      return (this as any).todos.filter((el: any) => {
        return self.current < 0 ? true : self.current === el.state
      }, this as any)
    }
  },
  methods: {
    // ToDo 追加の処理
    doAdd: function(event: any, value: any) {
      // ref で名前を付けておいた要素を参照
      let comment = this.$refs.comment as any
      // 入力がなければ何もしないで return
      if (!comment.value.length) {
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: this.todos.length,
        comment: comment.value,
        state: 0
      })
      // フォーム要素を空にする
      comment.value = ''
    },
    // 状態変更の処理
    doChangeState: function(item: any) {
      item.state = item.state ? 0 : 1
    },
    // 削除の処理
    doRemove: function(item: any) {
      const index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }
  },
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      // 引数はウォッチしているプロパティの変更後の値
      handler: function(todos) {
        ;(this as any).$localStorage.save(todos)
      },
      // deep オプションでネストしているデータも監視できる
      deep: true
    }
  },
  created() {
    // インスタンス作成時に自動的に fetch() する
    this.todos = (this as any).$localStorage.fetch()
  }
})
</script>
