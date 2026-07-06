import { pool } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const addFoodItem = async (req, res) => {
  try {
    const { name, price, category, food_type, shop_id } = req.body;

    let imageUrl = '';
    if (req.file) {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'vingo_foods',
  });

  // Delete the temporary file from your server
  fs.unlinkSync(req.file.path);

  // Save Cloudinary URL
  imageUrl = result.secure_url;
}
    const newItem = await pool.query(
      `INSERT INTO food_items (shop_id, name, image_url, price, category, food_type) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [shop_id, name, imageUrl, price, category, food_type]
    );

    res.status(201).json({ 
      message: 'Food item added! ', 
      item: newItem.rows[0] 
    });

  } catch (error) {
    console.error('Item Creation Error:', error);
    res.status(500).json({ message: 'Server Error ' });
  }
};
export const getMenuByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const menu = await pool.query(
      `SELECT * FROM food_items WHERE shop_id = $1 ORDER BY id DESC`,
      [shopId]
    );

    res.status(200).json(menu.rows);
  } catch (error) {
    console.error("Get Menu Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};