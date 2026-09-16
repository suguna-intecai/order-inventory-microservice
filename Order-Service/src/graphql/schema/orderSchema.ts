export const typeDefs = `#graphql

  enum OrderStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
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
    price: Float!
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
  quantity: Int
  status: OrderStatus
  price: Float
}

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
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

  type OrderConnection {
    orders: [Order!]!
    page: Int!
    limit: Int!
    total: Int!
    hasNextPage: Boolean!
  }

  type Query {
    getOrder(id: ID!): Order
    getOrders(
      page: Int
      limit: Int
    ): OrderConnection!
    getOrderItems(orderId: ID!): [OrderItem!]!
    getUserOrders(
      userId: ID!
      page: Int
      limit: Int
    ): OrderConnection!

    getUser(id: ID!): User

    getProduct(id: ID!): Product
    products(
      page: Int
      limit: Int
    ): ProductConnection!
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

    # Product operations
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;
