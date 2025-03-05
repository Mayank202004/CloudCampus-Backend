import Category from "../models/receipant.models.js";

// Add a new category
export const addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const newCategory = new Category({ category, subcategories: [] });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a subcategory to a category
export const addSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.body;
    const existingCategory = await Category.findOne({ category });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    existingCategory.subcategories.push({ name: subcategory, recipients: [] });
    await existingCategory.save();
    res.status(200).json(existingCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a recipient to a subcategory
export const addRecipient = async (req, res) => {
  try {
    const { category, subcategory, recipient } = req.body;
    const existingCategory = await Category.findOne({ category });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategoryObj = existingCategory.subcategories.find(
      (sub) => sub.name === subcategory
    );

    if (!subcategoryObj) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subcategoryObj.recipients.push(recipient);
    await existingCategory.save();
    res.status(200).json(existingCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all categories with subcategories and recipients
export const getAllCategories = async (_, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};