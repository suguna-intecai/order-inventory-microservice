import {
  Server,
  ServerCredentials,
  loadPackageDefinition,
} from "@grpc/grpc-js";

import { loadSync } from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

import { updateOrder } from "../controllers/orderController.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const protoPath = path.join(__dirname, "order.proto");

const packageDefinition = loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orderProto = loadPackageDefinition(packageDefinition) as any;

export const startGrpcServer = () => {
  const server = new Server();

  server.addService(orderProto.order.OrderService.service, {
    UpdateOrder: updateOrder,
  });

  const port = process.env.ORDER_GRPC_PORT || "50053";

  server.bindAsync(
    `0.0.0.0:${port}`,
    ServerCredentials.createInsecure(),
    (error, actualPort) => {
      if (error) {
        console.error("gRPC server failed:", error);

        return;
      }

      console.log(`Order gRPC server running on port ${actualPort}`);
    },
  );

  return server;
};
