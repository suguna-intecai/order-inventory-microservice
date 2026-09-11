import type { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
export declare const getInventory: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => Promise<void>;
export declare const checkStock: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => Promise<void>;
export declare const reserveStock: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => Promise<void>;
export declare const releaseStock: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => Promise<void>;
//# sourceMappingURL=inventoryController.d.ts.map