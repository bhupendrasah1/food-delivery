import { pool } from "../config/db.js";
import cloudinary from "../config/cloudinary.js"; // cloudinary इम्पोर्ट गर्न नबिर्सनुहोस्

export const addFood = async (req, res) => {
  const { name, price, description, shopId } = req.body;

  try {
    let imageUrl = null;

    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'vingo_foods',
      });
      imageUrl = result.secure_url; 
    }

    
    const result = await pool.query(
      `INSERT INTO ad_foods (name, price, description, image_url, shop_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, price, description, imageUrl, shopId]
    );

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      food: result.rows[0],
    });
  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllFoods = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ad_foods ORDER BY id DESC");
    // फ्रन्टइन्डमा Array चाहिन्छ, त्यसैले सिधै rows पठाउनुहोस्
    res.status(200).json({ success: true, foods: result.rows });
  } catch (error) {
    console.error("Get Foods Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch foods" });
  }
};

export const updateFood = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {
    const result = await pool.query(
      `UPDATE ad_foods
       SET name = COALESCE($1, name),
           price = COALESCE($2, price),
           description = COALESCE($3, description)
       WHERE id = $4
       RETURNING *`,
      [name ?? null, price ?? null, description ?? null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      food: result.rows[0],
    });
  } catch (error) {
    console.error("Update Food Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM ad_foods WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    console.error("Delete Food Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};