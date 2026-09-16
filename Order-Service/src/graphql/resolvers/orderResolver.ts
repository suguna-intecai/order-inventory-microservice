import { OrderStatus } from "../../entities/order.js";

import { OrderService } from "../../services/orderService.js";

import { UserService } from "../../services/userService.js";

import {
  createProduct,
  getProduct,
  listProducts,
  updateProduct,
  deleteProduct,
} from "../../grpc/inventoryClient.js";

const orderService = new OrderService();

const userService = new UserService();

export const resolvers = {
  // ========================================
  // ORDER FIELDS
  // ========================================

  Order: {
    quantity: (parent: any) =>
      Array.isArray(parent.items)
        ? parent.items.reduce(
            (sum: number, item: any) => sum + Number(item.quantity),
            0,
          )
        : 0,
  },

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

    getOrders: async (
      _parent: unknown,
      args: {
        page?: number;
        limit?: number;
      },
    ) => {
      return await orderService.listOrders(args.page ?? 1, args.limit ?? 10);
    },

    getOrderItems: async (
      _parent: unknown,
      args: {
        orderId: string;
      },
    ) => {
      return await orderService.getOrderItems(Number(args.orderId));
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

    getProduct: async (
      _parent: unknown,
      args: {
        id: string;
      },
    ) => {
      return await getProduct(Number(args.id));
    },

    products: async (
      _parent: unknown,
      args: {
        page?: number;
        limit?: number;
      },
    ) => {
      return await listProducts(args.page ?? 1, args.limit ?? 10);
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
          status?: OrderStatus;
          price?: number;
          quantity?: number;
        };
      },
    ) => {
      const updates: {
        userId?: number;
        status?: OrderStatus;
        price?: number;
        quantity?: number;
      } = {};

      if (args.input.userId !== undefined) {
        updates.userId = Number(args.input.userId);
      }

      if (args.input.status !== undefined) {
        updates.status = args.input.status;
      }

      if (args.input.price !== undefined) {
        updates.price = Number(args.input.price);
      }

      if (args.input.quantity !== undefined) {
        updates.quantity = Number(args.input.quantity);
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

    createProduct: async (
      _parent: unknown,
      args: {
        input: {
          name: string;
          isActive?: boolean;
        };
      },
    ) => {
      const input: { name: string; isActive?: boolean } = {
        name: args.input.name,
      };

      if (args.input.isActive !== undefined) {
        input.isActive = args.input.isActive;
      }

      return await createProduct(input);
    },

    updateProduct: async (
      _parent: unknown,
      args: {
        id: string;
        input: {
          name?: string;
          isActive?: boolean;
        };
      },
    ) => {
      const updates: { name?: string; isActive?: boolean } = {};

      if (args.input.name !== undefined) {
        updates.name = args.input.name;
      }

      if (args.input.isActive !== undefined) {
        updates.isActive = args.input.isActive;
      }

      return await updateProduct(Number(args.id), updates);
    },

    deleteProduct: async (
      _parent: unknown,
      args: {
        id: string;
      },
    ) => {
      return await deleteProduct(Number(args.id));
    },
  },
};
