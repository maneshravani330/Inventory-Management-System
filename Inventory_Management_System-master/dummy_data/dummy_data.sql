-- Inventory Management System - Dummy Data Insertion Script
-- Generated for testing and development purposes

USE inventory_db;

-- Clear existing data (optional - remove if you want to keep existing data)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE transactions;
-- TRUNCATE TABLE products;
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE suppliers;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- Insert Categories
INSERT INTO categories (name) VALUES 
('Electronics'),
('Clothing'),
('Home & Garden'),
('Sports & Recreation'),
('Books & Media'),
('Health & Beauty'),
('Automotive'),
('Food & Beverages'),
('Office Supplies'),
('Toys & Games');

-- Insert Suppliers
INSERT INTO suppliers (name, address) VALUES 
('TechnoSupply Inc.', '123 Technology Blvd, San Francisco, CA 94105'),
('Fashion Forward Ltd.', '456 Style Street, New York, NY 10001'),
('Garden Masters Co.', '789 Green Valley Ave, Portland, OR 97205'),
('SportZone Distributors', '321 Athletic Way, Denver, CO 80202'),
('BookWorld Supply', '654 Literature Lane, Austin, TX 73301'),
('Beauty Essentials Corp.', '987 Glamour Drive, Los Angeles, CA 90210'),
('AutoParts Plus', '147 Motor Mile, Detroit, MI 48201'),
('Fresh Foods Network', '258 Farm Road, Kansas City, MO 64108'),
('Office Solutions Inc.', '369 Business Blvd, Chicago, IL 60601'),
('Toy Kingdom Supply', '741 Fun Street, Orlando, FL 32801');

-- Insert Users with encoded passwords (Note: In real Spring Boot app, passwords are BCrypt encoded)
-- Password for all test users: "password123"
-- BCrypt encoded version: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.
INSERT INTO users (name, email, password, phone_number, role, created_at) VALUES 
('John Admin', 'admin@inventory.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '+1-555-0101', 'ADMIN', NOW()),
('Sarah Manager', 'manager@inventory.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '+1-555-0102', 'MANAGER', NOW()),
('Mike Johnson', 'mike.johnson@inventory.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '+1-555-0103', 'MANAGER', NOW()),
('Emily Davis', 'emily.davis@inventory.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '+1-555-0104', 'MANAGER', NOW()),
('David Wilson', 'david.wilson@inventory.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '+1-555-0105', 'ADMIN', NOW());

-- Insert Products
INSERT INTO products (name, sku, price, stock_quantity, description, category_id, created_at) VALUES 
-- Electronics (category_id: 1)
('iPhone 15 Pro', 'IPH15P-128', 999.99, 50, 'Latest iPhone with advanced camera and A17 chip', 1, NOW()),
('Samsung Galaxy S24', 'SGS24-256', 849.99, 45, 'Flagship Android smartphone with AI features', 1, NOW()),
('MacBook Air M3', 'MBA-M3-13', 1299.99, 25, '13-inch MacBook Air with M3 chip', 1, NOW()),
('Dell XPS 13', 'DXP13-I7', 1199.99, 30, 'Premium ultrabook with Intel i7 processor', 1, NOW()),
('AirPods Pro 2', 'APP2-USB', 249.99, 100, 'Wireless earbuds with active noise cancellation', 1, NOW()),

-- Clothing (category_id: 2)
('Levi''s 501 Jeans', 'LEV501-32W', 69.99, 80, 'Classic straight-fit denim jeans', 2, NOW()),
('Nike Air Max 90', 'NAM90-WHT', 129.99, 60, 'Iconic running shoes with Air cushioning', 2, NOW()),
('Adidas Originals Hoodie', 'ADO-HDY-L', 79.99, 40, 'Comfortable cotton blend hoodie', 2, NOW()),
('H&M Casual T-Shirt', 'HM-TEE-M', 19.99, 120, 'Basic cotton t-shirt in various colors', 2, NOW()),
('Zara Business Shirt', 'ZRA-BS-L', 49.99, 35, 'Professional dress shirt for office wear', 2, NOW()),

-- Home & Garden (category_id: 3)
('Dyson V15 Vacuum', 'DYS-V15-DET', 749.99, 20, 'Cordless vacuum with laser dust detection', 3, NOW()),
('KitchenAid Stand Mixer', 'KA-SM-RED', 379.99, 15, 'Professional 5-quart stand mixer', 3, NOW()),
('Philips Hue Smart Bulbs', 'PHU-SB-4PK', 199.99, 50, 'Color-changing smart LED bulbs pack of 4', 3, NOW()),
('IKEA Malm Bed Frame', 'IKE-MLM-Q', 299.99, 12, 'Modern queen size bed frame with storage', 3, NOW()),
('Ninja Foodi Pressure Cooker', 'NIN-FD-8QT', 199.99, 25, '8-quart multi-function pressure cooker', 3, NOW()),

-- Sports & Recreation (category_id: 4)
('Wilson Pro Tennis Racket', 'WIL-PR-285', 189.99, 30, 'Professional tennis racket for advanced players', 4, NOW()),
('Spalding NBA Basketball', 'SPA-NBA-29', 24.99, 75, 'Official size basketball with NBA logo', 4, NOW()),
('Yoga Mat Premium', 'YGA-PRM-6MM', 39.99, 90, 'Non-slip yoga mat with carrying strap', 4, NOW()),
('Bowflex Dumbbells', 'BWF-DB-55LB', 449.99, 20, 'Adjustable dumbbells up to 55 pounds each', 4, NOW()),
('Coleman Camping Tent', 'COL-TNT-4P', 159.99, 18, '4-person waterproof camping tent', 4, NOW()),

-- Books & Media (category_id: 5)
('The Psychology of Money', 'BK-POM-2020', 16.99, 150, 'Personal finance and investing book', 5, NOW()),
('Atomic Habits', 'BK-AH-2018', 18.99, 200, 'Self-help book about building good habits', 5, NOW()),
('The Thursday Murder Club', 'BK-TMC-2020', 14.99, 85, 'Mystery novel by Richard Osman', 5, NOW()),
('National Geographic Atlas', 'NG-ATL-2024', 29.99, 40, 'Latest world atlas with updated maps', 5, NOW()),
('Learn Python Programming', 'BK-LPP-2023', 49.99, 60, 'Comprehensive Python programming guide', 5, NOW()),

-- Health & Beauty (category_id: 6)
('CeraVe Facial Cleanser', 'CRV-FC-355ML', 12.99, 100, 'Gentle foaming facial cleanser for normal skin', 6, NOW()),
('Olaplex Hair Treatment', 'OLX-HT-NO3', 28.99, 70, 'Professional hair perfector treatment', 6, NOW()),
('Fitbit Charge 5', 'FBT-CH5-BLK', 179.99, 55, 'Advanced fitness tracker with GPS', 6, NOW()),
('The Ordinary Retinol', 'TO-RET-30ML', 6.99, 200, 'Anti-aging retinol serum', 6, NOW()),
('Neutrogena Sunscreen', 'NEU-SS-SPF50', 9.99, 150, 'Broad spectrum SPF 50 sunscreen', 6, NOW()),

-- Office Supplies (category_id: 9)
('Stapler Heavy Duty', 'STA-HD-BLK', 24.99, 45, 'Heavy duty desktop stapler', 9, NOW()),
('Printer Paper A4', 'PPR-A4-500', 8.99, 200, 'White multipurpose printer paper 500 sheets', 9, NOW()),
('Whiteboard Markers Set', 'WBM-SET-12', 15.99, 80, 'Set of 12 assorted color whiteboard markers', 9, NOW()),
('Office Chair Ergonomic', 'OCH-ERG-BLK', 299.99, 25, 'Ergonomic office chair with lumbar support', 9, NOW()),
('Desk Organizer Bamboo', 'DSK-ORG-BAM', 34.99, 60, 'Bamboo desktop organizer with compartments', 9, NOW());

-- Insert Transactions
INSERT INTO transactions (total_products, total_price, transaction_type, status, description, user_id, product_id, supplier_id, created_at) VALUES 
-- Purchase transactions (restocking inventory)
(20, 19999.80, 'PURCHASE', 'COMPLETED', 'Restocking iPhone 15 Pro for holiday season', 1, 1, 1, '2024-07-01 09:00:00'),
(15, 12749.85, 'PURCHASE', 'COMPLETED', 'Samsung Galaxy S24 inventory replenishment', 1, 2, 1, '2024-07-02 10:30:00'),
(10, 12999.90, 'PURCHASE', 'COMPLETED', 'MacBook Air M3 for back-to-school promotion', 2, 3, 1, '2024-07-03 14:15:00'),
(50, 3499.50, 'PURCHASE', 'COMPLETED', 'Levi''s jeans bulk order for summer collection', 2, 6, 2, '2024-07-05 11:20:00'),
(30, 3899.70, 'PURCHASE', 'COMPLETED', 'Nike Air Max 90 shoes restocking', 3, 7, 2, '2024-07-08 16:45:00'),
(25, 18749.75, 'PURCHASE', 'COMPLETED', 'Dyson vacuum cleaners for home appliance section', 1, 11, 3, '2024-07-10 09:30:00'),
(40, 999.60, 'PURCHASE', 'COMPLETED', 'Yoga mats for fitness equipment expansion', 4, 18, 4, '2024-07-12 13:15:00'),
(100, 1699.00, 'PURCHASE', 'COMPLETED', 'The Psychology of Money books bestseller restock', 2, 21, 5, '2024-07-15 10:00:00'),
(80, 1039.20, 'PURCHASE', 'COMPLETED', 'CeraVe facial cleansers beauty section', 3, 26, 6, '2024-07-18 15:30:00'),
(60, 2099.40, 'PURCHASE', 'COMPLETED', 'Office chairs for workspace furniture', 5, 32, 9, '2024-07-20 12:00:00'),

-- Sale transactions
(2, 1999.98, 'SALE', 'COMPLETED', 'Customer purchase - 2 iPhone 15 Pro', 3, 1, NULL, '2024-07-22 14:30:00'),
(1, 849.99, 'SALE', 'COMPLETED', 'Samsung Galaxy S24 sale to walk-in customer', 4, 2, NULL, '2024-07-22 16:15:00'),
(3, 209.97, 'SALE', 'COMPLETED', 'Levi''s jeans bundle purchase', 2, 6, NULL, '2024-07-23 11:45:00'),
(1, 129.99, 'SALE', 'COMPLETED', 'Nike shoes online order fulfillment', 3, 7, NULL, '2024-07-23 17:20:00'),
(2, 1499.98, 'SALE', 'COMPLETED', 'Dyson vacuum - corporate bulk order', 1, 11, NULL, '2024-07-24 09:00:00'),
(5, 199.95, 'SALE', 'COMPLETED', 'Yoga mats for fitness studio', 4, 18, NULL, '2024-07-24 13:30:00'),
(10, 169.90, 'SALE', 'COMPLETED', 'Psychology of Money books - book club order', 2, 21, NULL, '2024-07-25 10:15:00'),
(3, 38.97, 'SALE', 'COMPLETED', 'CeraVe cleanser beauty routine package', 5, 26, NULL, '2024-07-25 15:45:00'),
(1, 299.99, 'SALE', 'COMPLETED', 'Ergonomic office chair for home office', 3, 32, NULL, '2024-07-26 12:30:00'),
(4, 249.96, 'SALE', 'COMPLETED', 'AirPods Pro bulk purchase for employees', 1, 5, NULL, '2024-07-26 16:00:00'),

-- Return to supplier transactions
(5, 0.00, 'RETURN_TO_SUPPLIER', 'PROCESSING', 'Defective iPhone units returned to supplier', 1, 1, 1, '2024-07-28 10:00:00'),
(3, 0.00, 'RETURN_TO_SUPPLIER', 'COMPLETED', 'Damaged packaging Levi''s jeans return', 2, 6, 2, '2024-07-29 14:30:00'),
(2, 0.00, 'RETURN_TO_SUPPLIER', 'PENDING', 'Wrong model Nike shoes returned', 3, 7, 2, '2024-07-30 11:15:00'),
(1, 0.00, 'RETURN_TO_SUPPLIER', 'COMPLETED', 'Faulty Dyson vacuum returned for replacement', 4, 11, 3, '2024-07-30 16:45:00'),
(10, 0.00, 'RETURN_TO_SUPPLIER', 'PROCESSING', 'Damaged CeraVe cleanser bottles return', 5, 26, 6, '2024-07-31 09:30:00');

-- Display summary of inserted data
SELECT 'Data Insertion Summary:' as '';
SELECT COUNT(*) as 'Total Categories' FROM categories;
SELECT COUNT(*) as 'Total Suppliers' FROM suppliers;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Products' FROM products;
SELECT COUNT(*) as 'Total Transactions' FROM transactions;

SELECT 'Transaction Types Summary:' as '';
SELECT transaction_type, COUNT(*) as count FROM transactions GROUP BY transaction_type;

SELECT 'Transaction Status Summary:' as '';
SELECT status, COUNT(*) as count FROM transactions GROUP BY status;

SELECT 'Products by Category:' as '';
SELECT c.name as category, COUNT(p.id) as product_count 
FROM categories c 
LEFT JOIN products p ON c.id = p.category_id 
GROUP BY c.id, c.name 
ORDER BY product_count DESC;
