const { Router } = require("express");
const { 
  createOrder, 
  getConsumerOrders, 
  getFarmerOrders, 
  getOrderDetail,
  updateOrderStatus 
} = require("../controllers/ordersController");
const { authenticateToken, requireConsumer, requireFarmer } = require("../middlewares/authMiddleware");

const router = Router();

// Crear orden desde carrito (solo consumer)
router.post("/", authenticateToken, requireConsumer, createOrder);

// Obtener órdenes del consumer
router.get("/", authenticateToken, requireConsumer, getConsumerOrders);

// Obtener órdenes recibidas por farmer
router.get("/received", authenticateToken, requireFarmer, getFarmerOrders);

// Obtener detalle de orden (consumer o farmer dueño)
router.get("/:id", authenticateToken, getOrderDetail);

// Actualizar estado de orden (solo farmer dueño)
router.put("/:id/status", authenticateToken, requireFarmer, updateOrderStatus);


module.exports = router;