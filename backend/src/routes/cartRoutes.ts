const { Router } = require("express");
const { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require("../controllers/cartController");
const { authenticateToken, requireConsumer } = require("../middlewares/authMiddleware");

const router = Router();

// Todas las rutas requieren autenticación y ser consumer
router.post("/", authenticateToken, requireConsumer, addToCart);
router.get("/", authenticateToken, requireConsumer, getCart);
router.put("/:id", authenticateToken, requireConsumer, updateCartItem);
router.delete("/:id", authenticateToken, requireConsumer, removeFromCart);
router.delete("/", authenticateToken, requireConsumer, clearCart);

module.exports = router;