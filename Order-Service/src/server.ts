import "reflect-metadata";
import "dotenv/config";

import { createApp } from "./app.js";
import { AppDataSource } from "./config/database.js";
import { startGrpcServer } from "./grpc/orderGrpc.js";

const PORT = Number(process.env.PORT || 50052);

const startServer = async () => {
  try {
    await AppDataSource.initialize();

    console.log("Order PostgreSQL connected successfully");

    const app = await createApp();

    const server = app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);

      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });

    startGrpcServer();

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);

        console.error("Another Order Service instance may already be running.");

        process.exit(1);
      }

      console.error("Order Service server error:", error);

      process.exit(1);
    });
  } catch (error) {
    console.error("Order Service failed to start:", error);

    process.exit(1);
  }
};

startServer();
