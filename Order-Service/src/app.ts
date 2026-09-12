import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { typeDefs } from "./graphql/schema/orderSchema.js";
import { resolvers } from "./graphql/resolvers/orderResolver.js";

export const createApp = async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      service: "order-service",
      status: "UP",
    });
  });

  app.use("/graphql", expressMiddleware(apolloServer));

  return app;
};
