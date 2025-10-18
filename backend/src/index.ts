const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Importar y usar rutas
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Ruta de prueba principal
app.get("/", (req: any, res: any) => {
  res.send("🚜 Bienvenido a Agrisense Backend!");
});

// Ruta de prueba para la base de datos
app.get("/test-db", async (req: any, res: any) => {
  try {
    const { pool } = require("./db");
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({ 
      success: true, 
      message: "✅ Conexión a PostgreSQL exitosa",
      time: result.rows[0].current_time 
    });
  } catch (error) {
    console.error("Error conectando a la base de datos:", error);
    res.status(500).json({ 
      success: false, 
      error: "❌ Error conectando a la base de datos" 
    });
  }
});

// Importar y usar rutas de productos
const productsRoutes = require("./routes/productsRoutes");
app.use("/api/products", productsRoutes);

// Importar y usar rutas del carrito
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);


// Importar y usar rutas de órdenes
const ordersRoutes = require("./routes/ordersRoutes");
app.use("/api/orders", ordersRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Servidor Agrisense corriendo en http://localhost:${PORT}`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

