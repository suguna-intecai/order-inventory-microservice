export const typeDefs = `#graphql

  type Inventory {
    id: ID!
    productId: ID!
    quantity: Int!
    createdAt: String!
    updatedAt: String!
  }

  input StockInput {
    productId: ID!
    quantity: Int!
  }

  type StockCheckResult {
    available: Boolean!
    availableQuantity: Int!
  }

  type StockResult {
    success: Boolean!
    message: String!
    quantity: Int!
  }

  type Query {
    getInventory(productId: ID!): Inventory!
    checkStock(input: StockInput!): StockCheckResult!
  }

  type Mutation {
    reserveStock(input: StockInput!): StockResult!
    releaseStock(input: StockInput!): StockResult!
  }
`;
