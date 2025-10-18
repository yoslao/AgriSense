const { Router } = require("express");
const { 
  createProduct, 
  getProducts, 
  getProductById, 
  getMyProducts 
} = require("../controllers/productsController");
const { authenticateToken, requireFarmer } = require("../middlewares/authMiddleware");

const router = Router();

// Rutas públicas
router.get("/", getProducts);
router.get("/:id", getProductById);

// Rutas protegidas - solo farmers
router.post("/", authenticateToken, requireFarmer, createProduct);
router.get("/my/products", authenticateToken, requireFarmer, getMyProducts);

module.exports = router;