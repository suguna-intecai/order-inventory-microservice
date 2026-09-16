import { ProductService } from "../../services/productService.js";

const productService = new ProductService();

export const resolvers = {
  // ========================================
  // QUERY
  // ========================================

  Query: {
    getProduct: async (
      _parent: unknown,
      args: {
        id: string;
      },
    ) => {
      return await productService.getProduct(Number(args.id));
    },

    listProducts: async (
      _parent: unknown,
      args: {
        page?: number;
        limit?: number;
      },
    ) => {
      return await productService.listProducts(
        args.page ?? 1,
        args.limit ?? 10,
      );
    },
  },

  // ========================================
  // MUTATION
  // ========================================

  Mutation: {
    createProduct: async (
      _parent: unknown,
      args: {
        input: {
          name: string;
          isActive?: boolean;
        };
      },
    ) => {
      return await productService.createProduct(args.input);
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

      return await productService.updateProduct(Number(args.id), updates);
    },

    deleteProduct: async (
      _parent: unknown,
      args: {
        id: string;
      },
    ) => {
      return await productService.deleteProduct(Number(args.id));
    },
  },
};
