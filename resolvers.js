import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();
/*
const resolvers = {
  query: {
    hello: () => {
      return 'Hello there!'
    }
  },

  Subscription: {
    newUser: {
      subscribe: () => pubsub.asyncIterator(['NEW_USER'])
    }
  }
}

export default resolvers*/