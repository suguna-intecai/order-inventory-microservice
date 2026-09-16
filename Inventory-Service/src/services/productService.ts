import { Repository } from "typeorm";

import { AppDataSource } from "../config/database.js";
import { Product } from "../entities/product.js";

// ==========================================
// TYPES
// ==========================================

export interface CreateProductInput {
  name: string;
  isActive?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  isActive?: boolean;
}

export interface ListProductsResult {
  products: Product[];
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

// ==========================================
// PRODUCT SERVICE
// ==========================================

export class ProductService {
  private productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  // ==========================================
  // CREATE PRODUCT
  // ==========================================

  async createProduct(input: CreateProductInput): Promise<Product> {
    if (!input.name || !input.name.trim()) {
      throw new Error("Product name is required");
    }

    const product = this.productRepository.create({
      name: input.name.trim(),
      isActive: input.isActive ?? true,
    });

    return await this.productRepository.save(product);
  }

  // ==========================================
  // GET PRODUCT
  // ==========================================

  async getProduct(productId: number): Promise<Product | null> {
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error("Invalid product ID");
    }

    return await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
  }

  // ==========================================
  // LIST PRODUCTS
  // ==========================================

  async listProducts(
    page: number = 1,
    limit: number = 10,
  ): Promise<ListProductsResult> {
    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 10;
    }

    if (limit > 100) {
      limit = 100;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await this.productRepository.findAndCount({
      order: {
        id: "ASC",
      },

      skip,

      take: limit,
    });

    return {
      products,
      page,
      limit,
      total,
      hasNextPage: skip + products.length < total,
    };
  }

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  async updateProduct(
    productId: number,
    updates: UpdateProductInput,
  ): Promise<Product> {
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error("Invalid product ID");
    }

    const product = await this.getProduct(productId);

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    let hasChanges = false;

    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        throw new Error("Product name is required");
      }

      product.name = updates.name.trim();

      hasChanges = true;
    }

    if (updates.isActive !== undefined) {
      product.isActive = updates.isActive;

      hasChanges = true;
    }

    if (!hasChanges) {
      return product;
    }

    return await this.productRepository.save(product);
  }

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  async deleteProduct(productId: number): Promise<boolean> {
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error("Invalid product ID");
    }

    const product = await this.getProduct(productId);

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    await this.productRepository.remove(product);

    return true;
  }
}
