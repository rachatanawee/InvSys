-- Inventory System Database Schema

-- Locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  quantity INTEGER DEFAULT 0,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inventory movements table
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  type VARCHAR(20) CHECK (type IN ('RECEIVE', 'TRANSFER', 'SHIP')),
  from_location_id UUID REFERENCES locations(id),
  to_location_id UUID REFERENCES locations(id),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Insert mock locations
INSERT INTO locations (id, name) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Warehouse A'),
('550e8400-e29b-41d4-a716-446655440002', 'Warehouse B'),
('550e8400-e29b-41d4-a716-446655440003', 'Store Front'),
('550e8400-e29b-41d4-a716-446655440004', 'Distribution Center');

-- Insert mock products
INSERT INTO products (id, name, sku, quantity, location_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Laptop Dell XPS 13', 'DELL-XPS13-001', 25, '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'iPhone 15 Pro', 'APPLE-IP15P-001', 50, '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440003', 'Samsung Galaxy S24', 'SAMSUNG-GS24-001', 30, '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440004', 'MacBook Air M3', 'APPLE-MBA-M3-001', 15, '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440005', 'Gaming Mouse Logitech', 'LOGI-GM-001', 100, '550e8400-e29b-41d4-a716-446655440004');

-- Insert mock inventory movements
INSERT INTO inventory_movements (product_id, quantity, type, to_location_id, timestamp) VALUES
('660e8400-e29b-41d4-a716-446655440001', 25, 'RECEIVE', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15 10:00:00'),
('660e8400-e29b-41d4-a716-446655440002', 50, 'RECEIVE', '550e8400-e29b-41d4-a716-446655440001', '2024-01-16 14:30:00'),
('660e8400-e29b-41d4-a716-446655440003', 30, 'RECEIVE', '550e8400-e29b-41d4-a716-446655440002', '2024-01-17 09:15:00'),
('660e8400-e29b-41d4-a716-446655440001', 5, 'TRANSFER', '550e8400-e29b-41d4-a716-446655440003', '2024-01-18 11:45:00'),
('660e8400-e29b-41d4-a716-446655440002', 10, 'SHIP', NULL, '2024-01-19 16:20:00');