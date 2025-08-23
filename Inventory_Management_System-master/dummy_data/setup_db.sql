-- Create database
CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    supplier_id BIGINT,
    price DECIMAL(10,2),
    quantity_in_stock INT DEFAULT 0,
    min_stock_level INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    transaction_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert admin user (password is 'admin123')
INSERT IGNORE INTO users (email, name, password, role) VALUES 
('admin@gmail.com', 'Admin', '$2a$10$9XczQR4SuQBtmZGDQfAzp.8KPjRkv6pFGHELYrLBqN3AzxO9J2LYe', 'ADMIN');

-- Insert sample categories
INSERT IGNORE INTO categories (name, description) VALUES 
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items');

-- Insert sample supplier
INSERT IGNORE INTO suppliers (name, contact_person, email, phone, address) VALUES 
('Tech Supplies Inc', 'John Doe', 'john@techsupplies.com', '+1-555-0123', '123 Tech Street, Silicon Valley, CA');

-- Insert sample products
INSERT IGNORE INTO products (name, description, category_id, supplier_id, price, quantity_in_stock, min_stock_level, sku) VALUES 
('iPhone 14', 'Latest Apple smartphone', 1, 1, 999.99, 25, 5, 'APL-IPH14-001'),
('Samsung Galaxy S23', 'Samsung flagship smartphone', 1, 1, 899.99, 18, 5, 'SAM-GAL23-001'),
('MacBook Pro', 'Apple laptop computer', 1, 1, 1999.99, 8, 2, 'APL-MBP-001'),
('AirPods Pro', 'Apple wireless earbuds', 1, 1, 249.99, 45, 10, 'APL-APD-001'),
('iPad Air', 'Apple tablet computer', 1, 1, 599.99, 12, 3, 'APL-IPAD-001');

-- Insert sample transactions
INSERT IGNORE INTO transactions (product_id, transaction_type, quantity, unit_price, total_amount, description) VALUES 
(1, 'PURCHASE', 30, 999.99, 29999.70, 'Initial stock purchase'),
(2, 'PURCHASE', 25, 899.99, 22499.75, 'Initial stock purchase'),
(3, 'PURCHASE', 10, 1999.99, 19999.90, 'Initial stock purchase'),
(1, 'SALE', 5, 999.99, 4999.95, 'Sale to customer'),
(2, 'SALE', 7, 899.99, 6299.93, 'Sale to customer');
