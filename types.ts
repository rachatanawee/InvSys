
export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  locationId: string;
}

export interface Location {
  id: string;
  name: string;
}

export enum MovementType {
  RECEIVE = 'RECEIVE',
  TRANSFER = 'TRANSFER',
  SHIP = 'SHIP',
}

export interface InventoryMovement {
  id: string;
  productId: string;
  quantity: number;
  type: MovementType;
  fromLocationId?: string;
  toLocationId?: string;
  timestamp: string;
}
