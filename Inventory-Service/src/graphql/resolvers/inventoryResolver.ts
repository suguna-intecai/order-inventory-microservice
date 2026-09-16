import { InventoryService } from "../../services/inventoryService.js";

const inventoryService = new InventoryService();

export const resolvers = {
  // ========================================
  // QUERY
  // ========================================

  Query: {
    getInventory: async (
      _parent: unknown,
      args: {
        productId: string;
      },
    ) => {
      return await inventoryService.getInventory(Number(args.productId));
    },

    checkStock: async (
      _parent: unknown,
      args: {
        input: {
          productId: string;
          quantity: number;
        };
      },
    ) => {
      return await inventoryService.checkStock(
        Number(args.input.productId),
        Number(args.input.quantity),
      );
    },
  },

  // ========================================
  // MUTATION
  // ========================================

  Mutation: {
    reserveStock: async (
      _parent: unknown,
      args: {
        input: {
          productId: string;
          quantity: number;
        };
      },
    ) => {
      const result = await inventoryService.reserveStock(
        Number(args.input.productId),
        Number(args.input.quantity),
      );

      return {
        success: result.success,
        message: result.message,
        quantity: result.remainingQuantity,
      };
    },

    releaseStock: async (
      _parent: unknown,
      args: {
        input: {
          productId: string;
          quantity: number;
        };
      },
    ) => {
      return await inventoryService.releaseStock(
        Number(args.input.productId),
        Number(args.input.quantity),
      );
    },
  },
};
