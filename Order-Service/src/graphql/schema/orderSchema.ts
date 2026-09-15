

export const typeDefs = `#graphql

  enum OrderStatus {
    PENDING
    CONFIRMED
    CANCELLED
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type OrderItem {
    id: ID!
    productId: ID!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    userId: ID!
    status: OrderStatus!
    items: [OrderItem!]!
    createdAt: String!
    updatedAt: String!
  }

  input CreateOrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input CreateOrderInput {
    userId: ID!
    items: [CreateOrderItemInput!]!
  }

  input UpdateOrderInput {
    userId: ID
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  type OrderConnection {
    orders: [Order!]!
    page: Int!
    limit: Int!
    total: Int!
    hasNextPage: Boolean!
  }

  type Query {
    getOrder(id: ID!): Order
    getUserOrders(
      userId: ID!
      page: Int
      limit: Int
    ): OrderConnection!

    getUser(id: ID!): User
  }

  type Mutation {
    # Order operations
    createOrder(input: CreateOrderInput!): Order!
    updateOrder(id: ID!, input: UpdateOrderInput!): Order!
    deleteOrder(id: ID!): Boolean!

    cancelOrder(id: ID!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!

    # User operations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;