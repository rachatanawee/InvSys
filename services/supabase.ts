import { createClient } from '@supabase/supabase-js';
import { Product, Location, MovementType, InventoryMovement } from '../types';

// Read credentials from import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const shouldUseLiveApi = supabaseUrl && !supabaseUrl.startsWith('YOUR_') && supabaseAnonKey && !supabaseAnonKey.startsWith('YOUR_');

let supabaseService: any;

if (shouldUseLiveApi) {
    // --- LIVE IMPLEMENTATION ---
    const client = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Successfully connected to live Supabase instance.");

    supabaseService = {
        auth: {
            signInWithEmail: async ({ email, password }: { email: string, password?: string }) => {
                if (!password) throw new Error("Password is required for sign-in.");
                const { data, error } = await client.auth.signInWithPassword({ email, password });
                if (error) {
                    if (error.message.includes('Invalid login credentials')) throw new Error('Invalid credentials');
                    throw error;
                }
                return { data: { user: data.user }, error: null };
            },
            signOut: async () => {
                const { error } = await client.auth.signOut();
                if (error) console.error("Error signing out:", error);
            },
        },
        getProducts: async (): Promise<Product[]> => {
            const { data, error } = await client.from('products').select('*');
            if (error) throw error;
            return data.map(p => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                quantity: p.quantity,
                locationId: p.location_id
            }));
        },
        getLocations: async (): Promise<Location[]> => {
            const { data, error } = await client.from('locations').select('*');
            if (error) throw error;
            return data as Location[];
        },
        getMovements: async (): Promise<InventoryMovement[]> => {
            const { data, error } = await client
                .from('inventory_movements')
                .select('*')
                .order('timestamp', { ascending: false });
            if (error) throw error;
            return data.map(m => ({
                id: m.id,
                productId: m.product_id,
                quantity: m.quantity,
                type: m.type,
                fromLocationId: m.from_location_id,
                toLocationId: m.to_location_id,
                timestamp: m.timestamp
            }));
        },
        addMovement: async (
            type: MovementType,
            productId: string,
            quantity: number,
            fromLocationId?: string,
            toLocationId?: string
        ): Promise<any> => {
            const { data, error } = await client
                .from('inventory_movements')
                .insert({
                    product_id: productId,
                    quantity,
                    type,
                    from_location_id: fromLocationId,
                    to_location_id: toLocationId
                });
            if (error) throw error;
            return data;
        },
    };
} else {
    // --- MOCK IMPLEMENTATION ---
    console.warn("Supabase credentials not set or invalid. Falling back to mock data. Please configure your environment variables if you wish to connect to a live database.");

    const mockData: {
        products: Product[];
        locations: Location[];
        movements: InventoryMovement[];
        users: any[];
    } = {
        products: [
            { id: 'prod_1', name: 'Laptop Pro', sku: 'LP-001', quantity: 150, locationId: 'loc_1' },
            { id: 'prod_2', name: 'Wireless Mouse', sku: 'WM-002', quantity: 300, locationId: 'loc_2' },
            { id: 'prod_3', name: 'Mechanical Keyboard', sku: 'MK-003', quantity: 200, locationId: 'loc_1' },
            { id: 'prod_4', name: '4K Monitor', sku: '4KM-004', quantity: 80, locationId: 'loc_3' },
            { id: 'prod_5', name: 'USB-C Hub', sku: 'UCH-005', quantity: 500, locationId: 'loc_2' },
        ],
        locations: [
            { id: 'loc_1', name: 'Main Warehouse' },
            { id: 'loc_2', name: 'Downtown Store' },
            { id: 'loc_3', name: 'Eastside Depot' },
            { id: 'loc_4', name: 'Receiving Dock A' },
        ],
        movements: [
            { id: 'mov_1', productId: 'prod_1', quantity: 50, type: MovementType.RECEIVE, toLocationId: 'loc_1', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'mov_2', productId: 'prod_2', quantity: 10, type: MovementType.SHIP, fromLocationId: 'loc_2', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'mov_3', productId: 'prod_3', quantity: 20, type: MovementType.TRANSFER, fromLocationId: 'loc_1', toLocationId: 'loc_2', timestamp: new Date().toISOString() },
             { id: 'mov_4', productId: 'prod_1', quantity: 5, type: MovementType.SHIP, fromLocationId: 'loc_1', timestamp: new Date().toISOString() }
        ],
        users: [
            { id: 'user_1', email: 'demo@user.com', password: 'password' },
            { id: 'user_2', email: 'locked@user.com', password: 'password', locked: true },
        ],
    };

    const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

    supabaseService = {
        auth: {
            signInWithEmail: async ({ email, password }: { email: string, password?: string }) => {
                await simulateDelay(500);
                const user = mockData.users.find(u => u.email === email);
                if (!user || user.password !== password) {
                    throw new Error('Invalid credentials');
                }
                if (user.locked) {
                    throw new Error('Account locked');
                }
                const sessionUser = { id: user.id, email: user.email };
                return { data: { user: sessionUser }, error: null };
            },
            signOut: async () => {
                await simulateDelay(200);
            },
        },
        getProducts: async (): Promise<Product[]> => {
            await simulateDelay(400);
            return JSON.parse(JSON.stringify(mockData.products));
        },
        getLocations: async (): Promise<Location[]> => {
            await simulateDelay(300);
            return JSON.parse(JSON.stringify(mockData.locations));
        },
        getMovements: async (): Promise<InventoryMovement[]> => {
            await simulateDelay(500);
            const sortedMovements = [...mockData.movements].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            return JSON.parse(JSON.stringify(sortedMovements));
        },
        addMovement: async (
            type: MovementType,
            productId: string,
            quantity: number,
            fromLocationId?: string,
            toLocationId?: string
        ): Promise<void> => {
            await simulateDelay(600);
            const product = mockData.products.find(p => p.id === productId);
            if (!product) throw new Error("Product not found");

            if (type === 'SHIP' || type === 'TRANSFER') {
                if (!fromLocationId) throw new Error("Source location is required.");
                // In a real multi-location scenario, we'd check stock at the specific location.
                // For this mock, we assume all stock is at one location for simplicity.
                if (product.quantity < quantity) {
                    throw new Error("Insufficient stock at source location.");
                }
                product.quantity -= quantity;
            }
            if (type === 'RECEIVE' || type === 'TRANSFER') {
                if (!toLocationId) throw new Error("Destination location is required.");
                product.quantity += quantity;
            }

            const newMovement: InventoryMovement = {
                id: `mov_${Date.now()}`,
                productId,
                quantity,
                type,
                fromLocationId,
                toLocationId,
                timestamp: new Date().toISOString(),
            };
            mockData.movements.push(newMovement);
        },
    };
}


export const supabase = supabaseService;
