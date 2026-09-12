import {
  credentials,
  loadPackageDefinition,
} from "@grpc/grpc-js";

import { loadSync } from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.join(__dirname, "inventory.proto");

const packageDefinition = loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const inventoryProto = loadPackageDefinition(
  packageDefinition
) as any;

const client = new inventoryProto.inventory.InventoryService(
  "localhost:50051",
  credentials.createInsecure()
);


// RESERVE STOCK FUNCTION

const reserveStock = (
  productId: number,
  quantity: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.ReserveStock(
      {
        productId,
        quantity,
      },
      (error: Error | null, response: any) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(response);
      }
    );
  });
};



const runConcurrencyTest = async () => {
  console.log("CONCURRENCY TEST");

  console.log("Initial stock: 10");
  console.log("Customer A wants: 7");
  console.log("Customer B wants: 7");
  console.log("Total requested: 14");

  console.log(
    "Both requests are being sent at the SAME TIME"
  );

  // Send both requests at the same time
  const requestA = reserveStock(1, 7);
  const requestB = reserveStock(1, 7);

  const results = await Promise.allSettled([
    requestA,
    requestB,
  ]);


  console.log("RESULTS");
  results.forEach((result, index) => {
    const customer =
      index === 0 ? "Customer A" : "Customer B";

    if (result.status === "fulfilled") {
      console.log(`${customer} SUCCESS`);

      console.log(result.value);

      console.log();
    } else {
      console.log(`${customer} FAILED`);

      console.log(result.reason.message);

      console.log();
    }
  });

 
  console.log(" EXPECTED RESULT");
  console.log("✓ One customer should succeed");
  console.log("✓ One customer should fail");
  console.log("✓ Final stock should be 3");
  console.log("✓ Stock must NEVER become negative");

  process.exit(0);
};

runConcurrencyTest();