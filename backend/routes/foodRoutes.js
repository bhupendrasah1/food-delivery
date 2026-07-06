import express from "express";
import { addFood, getAllFoods, updateFood, deleteFood } from "../controllers/foodsController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, upload.single("image"), addFood);
router.get("/", getAllFoods);
router.put("/:id", protect, authorizeRoles('owner', 'admin'), updateFood);
router.delete("/:id", protect, authorizeRoles('owner', 'admin'), deleteFood);


export default router;
