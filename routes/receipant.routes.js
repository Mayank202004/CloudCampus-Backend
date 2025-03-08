import express from "express";
import {
  addCategory,
  addSubcategory,
  addRecipient,
  getAllCategories,
} from "../controllers/receipant.controller.js";

const router = express.Router();

router.post("/add-category", addCategory);
router.post("/add-subcategory", addSubcategory);
router.post("/add-recipient", addRecipient);
router.get("/categories", getAllCategories);

export default router;
