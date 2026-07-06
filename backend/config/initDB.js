import { pool } from './db.js'; 

export const initializeTables = async () => {
  // SQL Query to create the 'users' table automatically if it doesn't exist
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT, -- Google One-Tap Login को लागि यो खाली (null) हुन सक्छ
      role VARCHAR(50) DEFAULT 'user', -- 'user', 'owner', 'admin'
      mobile VARCHAR(15),
      google_id VARCHAR(255) UNIQUE,
      otp VARCHAR(6),
      otp_expiry TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      
    );
  `;

  const createShopTable = `
    CREATE TABLE IF NOT EXISTS shops (
      id SERIAL PRIMARY KEY,
      owner_id INT REFERENCES users(id) ON DELETE CASCADE, -- Links shop to its owner
      name VARCHAR(255) NOT NULL,
      description TEXT,
      address TEXT NOT NULL,
      image_url TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
   
  const createItemTable = `
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      shop_id INT REFERENCES shops(id) ON DELETE CASCADE, -- Links item to its restaurant
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url TEXT,
      is_available BOOLEAN DEFAULT true,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    const createOrderTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      total_amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Preparing', 'Out for Delivery', 'Delivered'
      payment_status VARCHAR(50) DEFAULT 'Unpaid', -- 'Unpaid', 'Paid'
      payment_method VARCHAR(50) DEFAULT 'cod', -- 'cod', 'khalti'
      payment_id VARCHAR(255), -- Stores Razorpay Payment ID
      delivery_address TEXT NOT NULL,
      latitude DECIMAL(10, 8), -- For Live Map Tracking
      longitude DECIMAL(11, 8), -- For Live Map Tracking
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INT REFERENCES orders(id) ON DELETE CASCADE,
      item_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL -- अर्डर गर्दाको समयको मूल्य सेभ गर्न
    );
  `;
  
  const createDeliveryBoyTable = `
    CREATE TABLE IF NOT EXISTS delivery_boys (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE, 
      current_latitude DECIMAL(10, 8), -- For Live Map Tracking
      current_longitude DECIMAL(11, 8), -- For Live Map Tracking
      is_available BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
   
  const createDeliveryAssignmentsTable = `
    CREATE TABLE IF NOT EXISTS delivery_assignments (
      id SERIAL PRIMARY KEY,
      order_id INT REFERENCES orders(id) ON DELETE CASCADE,
      delivery_boy_id INT REFERENCES delivery_boys(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'Assigned', -- 'Assigned', 'Picked Up', 'Delivered'
      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      delivered_at TIMESTAMP
    );
  `;
   
  const ad_foods = `
    CREATE TABLE IF NOT EXISTS ad_foods (
      id SERIAL PRIMARY KEY,  
      name VARCHAR(255) NOT NULL,
      description TEXT,
      food_type VARCHAR(50), -- e.g., 'Veg', 'Non-Veg', 'Vegan'
      shop_id INT REFERENCES shops(id) ON DELETE CASCADE, -- Links food to its restaurant
      price DECIMAL(10, 2) NOT NULL,
      image_url TEXT,
      is_available BOOLEAN DEFAULT true,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    // Execute the query
    await pool.query(createUserTableQuery);
    await pool.query(createShopTable);
    await pool.query(createItemTable);
    await pool.query(createOrderTable);
    await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cod'`);
    await pool.query(createOrderItemsTable);
    await pool.query(createDeliveryBoyTable);
    await pool.query(createDeliveryAssignmentsTable);
    await pool.query(ad_foods);
    await pool.query(`ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_item_id_fkey`);
    await pool.query(`ALTER TABLE order_items ADD CONSTRAINT order_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES ad_foods(id) ON DELETE CASCADE`);
    console.log('Database Tables Checked & Initialized Successfully!');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
};