import express from "express";
import multer from "multer";
import Product from "../models/productsModel.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Resolve directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Base URL for serving images
const baseUrl = process.env.BASE_URL || "http://localhost:5000";

// Create a new product with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file ? `${baseUrl}/uploads/${req.file.filename}` : "";
    const productData = { ...req.body, image: imagePath };
    const product = new Product(productData);
    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product with optional image upload
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) {
      updatedData.image = `${baseUrl}/uploads/${req.file.filename}`;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
