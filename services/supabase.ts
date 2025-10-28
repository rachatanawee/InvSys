import { Product, Location, MovementType, InventoryMovement } from '../types';

// Mock Data
const mockLocations: Location[] = [
  { id: 'loc_1', name: 'Main Warehouse' },
  { id: 'loc_2', name: 'Dock A' },
  { id: 'loc_3', name: 'Retail Storefront' },
  { id: 'loc_4', name: 'Overflow Storage' },
];

const mockProducts: Product[] = [
  { id: 'prod_1', name: 'Quantum Widget', sku: 'QW-1001', quantity: 150, locationId: 'loc_1' },
  { id: 'prod_2', name: 'Hyper Spanner', sku: 'HS-2023', quantity: 75, locationId: 'loc_1' },
  { id: 'prod_3', name: 'Flux Capacitor Core', sku: 'FC-C-003', quantity: 25, locationId: 'loc_2' },
  { id: 'prod_4', name: 'Photon Drill Bit', sku: 'PD-B-450', quantity: 500, locationId: 'loc_3' },
  { id: 'prod_5', name: 'Neutrino Probe', sku: 'NP-X9', quantity: 30, locationId: 'loc_4' },
  { id: 'prod_6', name: 'Plasma Injector', sku: 'PI-778', quantity: 200, locationId: 'loc_1' },
  { id: 'prod_7', name: 'Tachyon Emitter', sku: 'TE-5G', quantity: 120, locationId: 'loc_2' },
  { id: 'prod_8', name: 'Gravity Plating', sku: 'GP-99', quantity: 800, locationId: 'loc_3' },
  { id: 'prod_9', name: 'Dark Matter Filter', sku: 'DMF-01', quantity: 5, locationId: 'loc_4' },
  { id: 'prod_10', name: 'Warp Coil', sku: 'WC-42', quantity: 95, locationId: 'loc_1' },
];

let mockMovements: InventoryMovement[] = [
  { id: 'mov_1', productId: 'prod_1', quantity: 50, type: MovementType.RECEIVE, toLocationId: 'loc_1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: 'mov_2', productId: 'prod_2', quantity: 25, type: MovementType.TRANSFER, fromLocationId: 'loc_1', toLocationId: 'loc_2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString() },
  { id: 'mov_3', productId: 'prod_4', quantity: 100, type: MovementType.SHIP, fromLocationId: 'loc_3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  { id: 'mov_4', productId: 'prod_3', quantity: 10, type: MovementType.RECEIVE, toLocationId: 'loc_2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { id: 'mov_5', productId: 'prod_1', quantity: 5, type: MovementType.SHIP, fromLocationId: 'loc_1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() },
];

// Mock Supabase client
// In a real app, this would be initialized with `createClient` from '@supabase/supabase-js'
const supabase = {
  auth: {
    signInWithEmail: async ({ email, password }: { email: string, password?: string }) => {
      console.log(`Attempting to sign in with email: ${email}`);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      if (email === 'locked@user.com') {
        throw new Error('Account locked. Please contact support.');
      }
      
      if (email === 'demo@user.com' && password === 'password') {
        const user = { id: 'user_1', email };
        return { data: { user }, error: null };
      }
      
      throw new Error('Invalid credentials. Please try again.');
    },
    signOut: async () => {
      console.log('Signing out...');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { error: null };
    }
  },
  
  getProducts: async (): Promise<Product[]> => {
    console.log('Fetching products...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return JSON.parse(JSON.stringify(mockProducts));
  },

  getLocations: async (): Promise<Location[]> => {
    console.log('Fetching locations...');
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(JSON.stringify(mockLocations));
  },

  getMovements: async (): Promise<InventoryMovement[]> => {
    console.log('Fetching movements...');
    await new Promise(resolve => setTimeout(resolve, 700));
    return JSON.parse(JSON.stringify(mockMovements)).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  addMovement: async (
    type: MovementType,
    productId: string,
    quantity: number,
    fromLocationId?: string,
    toLocationId?: string
  ): Promise<InventoryMovement> => {
    console.log('Adding movement...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (type === MovementType.RECEIVE) {
      if (!toLocationId) throw new Error("Destination location is required for receiving stock.");
      const targetProduct = mockProducts.find(p => p.id === productId && p.locationId === toLocationId);
      if (targetProduct) {
        targetProduct.quantity += quantity;
      } else {
         // Assuming new stock of an existing product can arrive at a new location
         const newProductEntry = {...product, locationId: toLocationId, quantity: quantity };
         mockProducts.push(newProductEntry);
      }
    } else if (type === MovementType.SHIP) {
        if (!fromLocationId) throw new Error("Source location is required for shipping stock.");
        const sourceProduct = mockProducts.find(p => p.id === productId && p.locationId === fromLocationId);
        if (!sourceProduct || sourceProduct.quantity < quantity) {
            throw new Error("Insufficient stock to ship.");
        }
        sourceProduct.quantity -= quantity;
    } else if (type === MovementType.TRANSFER) {
        if (!fromLocationId || !toLocationId) throw new Error("Both source and destination locations are required for transfers.");
        const sourceProduct = mockProducts.find(p => p.id === productId && p.locationId === fromLocationId);
        if (!sourceProduct || sourceProduct.quantity < quantity) {
            throw new Error("Insufficient stock to transfer.");
        }
        sourceProduct.quantity -= quantity;

        const destProduct = mockProducts.find(p => p.id === productId && p.locationId === toLocationId);
        if(destProduct) {
            destProduct.quantity += quantity;
        } else {
            mockProducts.push({ ...product, quantity, locationId: toLocationId });
        }
    }

    const newMovement: InventoryMovement = {
      id: `mov_${mockMovements.length + 1}`,
      productId,
      quantity,
      type,
      fromLocationId,
      toLocationId,
      timestamp: new Date().toISOString(),
    };
    mockMovements.push(newMovement);
    
    return JSON.parse(JSON.stringify(newMovement));
  },
};

export { supabase };