import { OrderStatus } from "../../entities/order.js";

import { OrderService } from "../../services/orderService.js";

import { UserService } from "../../services/userService.js";

const orderService = new OrderService();

const userService = new UserService();

export const resolvers = {
  // ========================================
  // QUERY
  // ========================================

  Query: {
    getOrder: async (
      _parent: unknown,
      args: {
        id: string;
      },
    ) => {
      return await orderService.getOrder(Number(args.id));
    },

    getUserOrders: async (
      _parent: unknown,
      args: {
        userId: string;
        page?: number;
        limit?: number;
      },
    ) => {
      return await orderService.getUserOrders(
        Number(args.userId),
        args.page ?? 1,
        args.limit ?? 10,
      );
    },

    getUser: async (
      _parent: unknown,
      args: {
        id: string;
      },
    ) => {
      return await userService.getUserById(Number(args.id));
    },
  },

  // ========================================
  // MUTATION
  // ========================================

  Mutation: {
    createOrder: async (
      _parent: unknown,
      args: {
        input: {
          userId: string;
          items: {
            productId: string;
            quantity: number;
          }[];
        };
      },
    ) => {
      return await orderService.createOrder({
        userId: Number(args.input.userId),

        items: args.input.items.map((item) => ({
          productId: Number(item.productId),

          quantity: Number(item.quantity),
        })),
      });
    },

    updateOrder: async (
      _parent: unknown,
      args: {
        id: string;
        input: {
          userId?: string;
        };
      },
    ) => {
      const updates: { userId?: number } = {};

      if (args.input.userId !== undefined) {
        updates.userId = Number(args.input.userId);
      }

      return await orderService.updateOrder(Number(args.id), updates);
    },

    deleteOrder: async (
      _parent: unknown,
      args: {
        id: string;
      },
    ) => {
      return await orderService.deleteOrder(Number(args.id));
    },

    cancelOrder: async (
      _parent: unknown,
      args: {
        id: string;
      },
    ) => {
      return await orderService.cancelOrder(Number(args.id));
    },

    updateOrderStatus: async (
      _parent: unknown,
      args: {
        id: string;
        status: OrderStatus;
      },
    ) => {
      return await orderService.updateOrderStatus(Number(args.id), args.status);
    },

    createUser: async (
      _parent: unknown,
      args: {
        input: {
          name: string;
          email: string;
        };
      },
    ) => {
      return await userService.createUser(args.input.name, args.input.email);
    },

    updateUser: async (
      _parent: unknown,
      args: {
        id: string;
        input: {
          name?: string;
          email?: string;
        };
      },
    ) => {
      const updates: { name?: string; email?: string } = {};

      if (args.input.name !== undefined) {
        updates.name = args.input.name;
      }

      if (args.input.email !== undefined) {
        updates.email = args.input.email;
      }

      return await userService.updateUser(Number(args.id), updates);
    },

    deleteUser: async (
      _parent: unknown,
      args: {
        id: string;
      },
    ) => {
      return await userService.deleteUser(Number(args.id));
    },
  },
};
