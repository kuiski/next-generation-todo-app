import Vue from 'vue'
import {TodoStorage} from '~/plugins/local-storage'

declare module '*.vue' {
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $localStorage: TodoStorage
  }
}
