import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  recipients: [recipientSchema], 
});

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategories: [subcategorySchema], 
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
