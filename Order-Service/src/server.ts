import "reflect-metadata";
import "dotenv/config";

import { createApp } from "./app.js";
import { AppDataSource } from "./config/database.js";

const PORT = Number(process.env.PORT || 50052);

const startServer = async () => {
  try {
    await AppDataSource.initialize();

    console.log("Order PostgreSQL connected successfully");

    const app = await createApp();

    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);

      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Order Service failed to start:", error);

    process.exit(1);
  }
};

startServer();
