export const typeDefs = `#graphql

  type Product {
    id: ID!
    name: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateProductInput {
    name: String!
    isActive: Boolean
  }

  input UpdateProductInput {
    name: String
    isActive: Boolean
  }

  type ProductConnection {
    products: [Product!]!
    page: Int!
    limit: Int!
    total: Int!
    hasNextPage: Boolean!
  }

  type Query {
    getProduct(id: ID!): Product
    listProducts(
      page: Int
      limit: Int
    ): ProductConnection!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;
