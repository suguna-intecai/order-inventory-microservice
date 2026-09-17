import { status } from "@grpc/grpc-js";
import type { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";

import { Order, OrderStatus } from "../entities/order.js";

import { OrderItem } from "../entities/orderItems.js";

import { OrderService } from "../services/orderService.js";

const orderService = new OrderService();

const serializeOrder = (order: Order) => ({
  id: order.id,
  userId: order.userId,
  status: order.status,
  price: Number(order.price),
  items: (order.items ?? []).map((item: OrderItem) => ({
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    quantity: item.quantity,
    price: Number(item.price),
    createdAt:
      item.createdAt instanceof Date
        ? item.createdAt.toISOString()
        : String(item.createdAt),
  })),
  createdAt:
    order.createdAt instanceof Date
      ? order.createdAt.toISOString()
      : String(order.createdAt),
  updatedAt:
    order.updatedAt instanceof Date
      ? order.updatedAt.toISOString()
      : String(order.updatedAt),
});

export const updateOrder = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { id, userId, status: statusValue, price, quantity } = call.request;

    if (!Number.isInteger(id) || id <= 0) {
      callback({
        code: status.INVALID_ARGUMENT,
        message: "Invalid order ID",
      });

      return;
    }

    const updates: {
      userId?: number;
      status?: OrderStatus;
      price?: number;
      quantity?: number;
    } = {};

    if (userId !== undefined) {
      updates.userId = Number(userId);
    }

    if (statusValue !== undefined) {
      if (!Object.values(OrderStatus).includes(statusValue)) {
        callback({
          code: status.INVALID_ARGUMENT,
          message: `Invalid order status: ${statusValue}`,
        });

        return;
      }

      updates.status = statusValue;
    }

    if (price !== undefined) {
      updates.price = Number(price);
    }

    if (quantity !== undefined) {
      updates.quantity = Number(quantity);
    }

    const order = await orderService.updateOrder(Number(id), updates);

    if (!order) {
      throw new Error(`Order ${id} not found`);
    }

    callback(null, {
      order: serializeOrder(order),
    });
  } catch (error) {
    callback({
      code: status.NOT_FOUND,
      message: error instanceof Error ? error.message : "Order update failed",
    });
  }
};
