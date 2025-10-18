const { pool } = require("../db");

// Agregar producto al carrito
const addToCart = async (req: any, res: any) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.userId; // Del middleware de autenticación

    // Validar campos
    if (!product_id || !quantity) {
      return res.status(400).json({
        success: false,
        error: "product_id y quantity son requeridos"
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "La cantidad debe ser mayor a 0"
      });
    }

    // Verificar si el producto existe y tiene stock
    const productResult = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND available_qty >= $2",
      [product_id, quantity]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado o sin stock suficiente"
      });
    }

    const product = productResult.rows[0];

    // Verificar si el producto ya está en el carrito
    const existingCartItem = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, product_id]
    );

    if (existingCartItem.rows.length > 0) {
      // Actualizar cantidad si ya existe
      const newQuantity = existingCartItem.rows[0].quantity + quantity;
      
      await pool.query(
        "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
        [newQuantity, userId, product_id]
      );
    } else {
      // Insertar nuevo item en el carrito
      await pool.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [userId, product_id, quantity]
      );
    }

    res.status(201).json({
      success: true,
      message: "Producto agregado al carrito exitosamente"
    });

  } catch (error) {
    console.error("Error agregando al carrito:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Obtener carrito del usuario actual
const getCart = async (req: any, res: any) => {
  try {
    const userId = req.userId;

    const result = await pool.query(`
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        p.id as product_id,
        p.name,
        p.category,
        p.price_per_kg,
        p.available_qty,
        p.description,
        p.image_url,
        u.name as farmer_name,
        u.district as farmer_district,
        u.city as farmer_city,
        (ci.quantity * p.price_per_kg) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      JOIN users u ON p.farmer_id = u.id
      WHERE ci.user_id = $1
      ORDER BY ci.created_at DESC
    `, [userId]);

    // Calcular total
    const total = result.rows.reduce((sum: number, item: any) => {
      return sum + parseFloat(item.subtotal);
    }, 0);

    res.json({
      success: true,
      count: result.rows.length,
      total: total.toFixed(2),
      items: result.rows
    });

  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Actualizar cantidad en el carrito
const updateCartItem = async (req: any, res: any) => {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.id;
    const userId = req.userId;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: "Cantidad válida es requerida"
      });
    }

    // Verificar que el item pertenece al usuario
    const cartItem = await pool.query(
      "SELECT * FROM cart_items WHERE id = $1 AND user_id = $2",
      [cartItemId, userId]
    );

    if (cartItem.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Item del carrito no encontrado"
      });
    }

    if (quantity === 0) {
      // Eliminar item si cantidad es 0
      await pool.query(
        "DELETE FROM cart_items WHERE id = $1 AND user_id = $2",
        [cartItemId, userId]
      );
      
      return res.json({
        success: true,
        message: "Producto eliminado del carrito"
      });
    }

    // Verificar stock disponible
    const productInfo = await pool.query(`
      SELECT p.available_qty 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = $1
    `, [cartItemId]);

    if (productInfo.rows[0].available_qty < quantity) {
      return res.status(400).json({
        success: false,
        error: "Stock insuficiente"
      });
    }

    // Actualizar cantidad
    await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3",
      [quantity, cartItemId, userId]
    );

    res.json({
      success: true,
      message: "Cantidad actualizada exitosamente"
    });

  } catch (error) {
    console.error("Error actualizando carrito:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Eliminar item del carrito
const removeFromCart = async (req: any, res: any) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.userId;

    const result = await pool.query(
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *",
      [cartItemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Item del carrito no encontrado"
      });
    }

    res.json({
      success: true,
      message: "Producto eliminado del carrito"
    });

  } catch (error) {
    console.error("Error eliminando del carrito:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Vaciar carrito completo
const clearCart = async (req: any, res: any) => {
  try {
    const userId = req.userId;

    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1",
      [userId]
    );

    res.json({
      success: true,
      message: "Carrito vaciado exitosamente"
    });

  } catch (error) {
    console.error("Error vaciando carrito:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};