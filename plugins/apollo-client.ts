import { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'
import ApolloClient from 'apollo-boost'

export default function({ app }: any) {
  app.setup = () => {
    const apolloClient = new ApolloClient({
      uri: process.env.FAUNA_ENDPOINT,
      request: (operation) => {
        const token = process.env.FAUNA_TOKEN
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : '',
            'X-Schema-Preview': 'partial-update-mutation'
          }
        })
      }
    })

    provide(DefaultApolloClient, apolloClient)
  }
}
