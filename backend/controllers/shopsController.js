// backend/controllers/shopController.js
import { pool } from '../config/db.js';
import cloudinary from "../config/cloudinary.js";

export const createShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    const owner_id = req.user.id; 

    
    const fullAddress = `${address}, ${city}, ${state}`;

    let imageUrl = '';
    
  
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'vingo_shops',
      });
      imageUrl = result.secure_url; 
    }
    
    const newShop = await pool.query(
      `INSERT INTO shops (owner_id, name, image_url, address) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [owner_id, name, imageUrl, fullAddress]
    );

    res.status(201).json({ 
      message: 'Shop created successfully! 🏪', 
      shop: newShop.rows[0] 
    });

  } catch (error) {
    console.error('Shop Creation Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getShops = async (req, res) => {
  try {
    const shops = await pool.query('SELECT * FROM shops');
    res.status(200).json({ shops: shops.rows });
  } catch (error) {
    console.error('Fetching Shops Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

