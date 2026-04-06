import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// TODO: Update this URL to your backend's address
const httpLink = createHttpLink({
  uri: 'http://10.0.2.2:8080/graphql', // Android emulator → localhost
  // uri: 'http://localhost:8080/graphql', // iOS simulator / web
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
