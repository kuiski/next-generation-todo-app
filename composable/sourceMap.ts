import { ref, Ref, inject, InjectionKey } from '@vue/composition-api'

export const DefaultSourceMap: InjectionKey<Ref<SourceMapType>> = Symbol(
  'default-source-map'
)

export interface SourceMap {
  filename: string
  code: string
}

type SourceMapType = SourceMap[]

export const createSourceMap = (): Ref<SourceMapType> => ref([])

export const useSourceMap = (paths?: string[]): Ref<SourceMapType> => {
  const providedSourceMap: Ref<SourceMapType> | null = inject(
    DefaultSourceMap,
    null
  )

  if (!providedSourceMap) {
    throw Error('useSourceMap requires provide SourceMap before use')
  }

  if (paths) {
    ;(async () => {
      const maps: SourceMapType = []
      for await (const path of paths) {
        const res = await fetch(path)
        const src = await res.text()
        maps.push({
          filename: path,
          code: src
        })
      }
      providedSourceMap.value = maps
    })()
  }

  return providedSourceMap
}
