<template>
  <div>
    <el-tabs type="card" value="1" @tab-click="handleClick">
      <el-tab-pane label="Back">
        <span slot="label"><i class="el-icon-back"></i></span>
      </el-tab-pane>
      <el-tab-pane label="Output">
        <nuxt />
      </el-tab-pane>
      <el-tab-pane label="Code">
        <div class="code-container">
          <div v-for="src in srcs" class="code">
            <div class="code-header">
              <span class="code-filename">{{ src.filename }}</span>
            </div>
            <pre v-highlightjs="src.code" class="code-body"><code></code></pre>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.code {
  padding: 10px 50px 50px 20px;
}

.code-header {
}

.code-filename {
  margin: 0;
  border-top: 1px solid #888;
  border-left: 1px solid #888;
  border-right: 1px solid #888;
  border-radius: 2px;
  background-color: #eef;
}

.code-body {
  margin: 0;
  padding: 0;
  border: 1px solid #888;
}
.code-body code {
  margin: 0;
}
</style>

<script lang="ts">
import { defineComponent, provide } from '@vue/composition-api'

import {
  useSourceMap,
  DefaultSourceMap,
  createSourceMap
} from '../composable/sourceMap'

export default defineComponent({
  setup(_props, context) {
    provide(DefaultSourceMap, createSourceMap())
    const srcs = useSourceMap()

    const handleClick = (tab, event) => {
      if (tab.label === 'Back') {
        context.root.$router.push('/')
      }
    }

    return {
      srcs,
      handleClick
    }
  }
})
</script>
