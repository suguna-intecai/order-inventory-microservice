import { Inventory } from "../entities/inventory.js";
export declare class InventoryService {
    private inventoryRepository;
    getInventory(productId: number): Promise<Inventory>;
    checkStock(productId: number, quantity: number): Promise<{
        available: boolean;
        availableQuantity: number;
    }>;
    reserveStock(productId: number, quantity: number): Promise<{
        success: boolean;
        message: string;
        remainingQuantity: number;
    }>;
    releaseStock(productId: number, quantity: number): Promise<{
        success: boolean;
        message: string;
        quantity: number;
    }>;
}
//# sourceMappingURL=inventoryService.d.ts.map