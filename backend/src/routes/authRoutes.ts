const { Router } = require("express");
const { register, login, getProfile } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);

// Ruta protegida - requiere autenticación
router.get("/profile", authenticateToken, getProfile);

module.exports = router;