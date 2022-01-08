import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { gql } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();


const typeDefs = gql`
    type Query {
        hello: String!
    }
    
    type Message {
        msg: String
    }

    type Subscription {
        newUser: Message
    }
`

const resolvers = {
  Query: {
    hello: () => {
      pubsub.publish('NEW_USER', {msg: '12'})
      return 'Hello there!'
    }
  },

  Subscription: {
    newUser: {
      subscribe: (a,b,p) => pubsub.asyncIterator(['NEW_USER']),
      //subscribe: () => pubsub.asyncIterator(['NEW_USER']),
      resolve: (payload) => {
        return payload
      }
    }
  }
}




const ff = async function () {
  const app = express();

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create(
      { schema, execute, subscribe },
      { server: httpServer, path: '/graphql' }
  );

  const server = new ApolloServer({
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () =>
      console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
};

await ff()