const { pool } = require("../db");

// Crear nuevo producto (solo farmers)
const createProduct = async (req: any, res: any) => {
  try {
    const { name, category, price_per_kg, available_qty, description, image_url } = req.body;
    const farmerId = req.userId; // Del middleware de autenticación

    // Validar campos requeridos
    if (!name || !category || !price_per_kg || !available_qty) {
      return res.status(400).json({
        success: false,
        error: "Nombre, categoría, precio y cantidad son requeridos"
      });
    }

    // Validar categoría
    const validCategories = ['frutas', 'verduras', 'semillas', 'tuberculos'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: "Categoría debe ser: frutas, verduras, semillas o tuberculos"
      });
    }

    // Insertar producto
    const result = await pool.query(
      `INSERT INTO products 
       (farmer_id, name, category, price_per_kg, available_qty, description, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [farmerId, name, category, price_per_kg, available_qty, description, image_url]
    );

    const newProduct = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      product: newProduct
    });

  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Obtener todos los productos
const getProducts = async (req: any, res: any) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        u.name as farmer_name,
        u.district as farmer_district,
        u.city as farmer_city
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.available_qty > 0
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows
    });

  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Obtener producto por ID
const getProductById = async (req: any, res: any) => {
  try {
    const productId = req.params.id;

    const result = await pool.query(`
      SELECT 
        p.*,
        u.name as farmer_name,
        u.district as farmer_district,
        u.city as farmer_city,
        u.email as farmer_email
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.id = $1
    `, [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado"
      });
    }

    res.json({
      success: true,
      product: result.rows[0]
    });

  } catch (error) {
    console.error("Error obteniendo producto:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Obtener productos del farmer actual
const getMyProducts = async (req: any, res: any) => {
  try {
    const farmerId = req.userId;

    const result = await pool.query(`
      SELECT * FROM products 
      WHERE farmer_id = $1 
      ORDER BY created_at DESC
    `, [farmerId]);

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows
    });

  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts
};