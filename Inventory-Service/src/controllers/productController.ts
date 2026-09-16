import { status } from "@grpc/grpc-js";
import type { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";

import { ProductService } from "../services/productService.js";

const productService = new ProductService();

// ==========================================
// SERIALIZE
// ==========================================

const serializeProduct = (product: any) => ({
  id: product.id,
  name: product.name,
  isActive: product.isActive,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});

// ==========================================
// CREATE PRODUCT
// ==========================================

export const createProduct = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { name, isActive } = call.request;

    const product = await productService.createProduct({ name, isActive });

    callback(null, {
      product: serializeProduct(product),
    });
  } catch (error) {
    callback({
      code: status.INVALID_ARGUMENT,
      message:
        error instanceof Error ? error.message : "Unable to create product",
    });
  }
};

// ==========================================
// GET PRODUCT
// ==========================================

export const getProduct = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { id } = call.request;

    const product = await productService.getProduct(id);

    if (!product) {
      throw new Error(`Product ${id} not found`);
    }

    callback(null, {
      product: serializeProduct(product),
    });
  } catch (error) {
    callback({
      code: status.NOT_FOUND,
      message: error instanceof Error ? error.message : "Product not found",
    });
  }
};

// ==========================================
// LIST PRODUCTS
// ==========================================

export const listProducts = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { page = 1, limit = 10 } = call.request;

    const result = await productService.listProducts(page, limit);

    callback(null, {
      products: result.products.map(serializeProduct),
      page: result.page,
      limit: result.limit,
      total: result.total,
      hasNextPage: result.hasNextPage,
    });
  } catch (error) {
    callback({
      code: status.INTERNAL,
      message:
        error instanceof Error ? error.message : "Unable to list products",
    });
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

export const updateProduct = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { id } = call.request;

    const updates: { name?: string; isActive?: boolean } = {};

    if (call.request.name !== undefined) {
      updates.name = call.request.name;
    }

    if (call.request.isActive !== undefined) {
      updates.isActive = call.request.isActive;
    }

    const product = await productService.updateProduct(id, updates);

    callback(null, {
      product: serializeProduct(product),
    });
  } catch (error) {
    callback({
      code: status.INVALID_ARGUMENT,
      message:
        error instanceof Error ? error.message : "Unable to update product",
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================

export const deleteProduct = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { id } = call.request;

    const success = await productService.deleteProduct(id);

    callback(null, {
      success,
    });
  } catch (error) {
    callback({
      code: status.NOT_FOUND,
      message:
        error instanceof Error ? error.message : "Unable to delete product",
    });
  }
};
