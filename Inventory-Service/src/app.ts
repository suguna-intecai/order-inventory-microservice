import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { typeDefs as productTypeDefs } from "./graphql/schema/productSchema.js";
import { resolvers as productResolvers } from "./graphql/resolvers/productResolver.js";

import { typeDefs as inventoryTypeDefs } from "./graphql/schema/inventorySchema.js";
import { resolvers as inventoryResolvers } from "./graphql/resolvers/inventoryResolver.js";

export const createApp = async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs: [productTypeDefs, inventoryTypeDefs],

    resolvers: {
      Query: {
        ...productResolvers.Query,
        ...inventoryResolvers.Query,
      },

      Mutation: {
        ...productResolvers.Mutation,
        ...inventoryResolvers.Mutation,
      },
    },
  });

  await apolloServer.start();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      service: "inventory-service",
      status: "UP",
    });
  });

  app.use("/graphql", expressMiddleware(apolloServer));

  return app;
};
