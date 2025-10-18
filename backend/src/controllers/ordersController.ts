const { pool } = require("../db");

const createOrder = async (req: any, res: any) => {
  console.log("🎯 ORDEN SIMPLIFICADA - INICIANDO");
  
  try {
    const userId = req.userId;
    const { payment_method, shipping_address } = req.body;

    console.log("1. 📦 Datos recibidos:", { userId, payment_method, shipping_address });

    // Validación mínima
    if (!payment_method) {
      return res.status(400).json({ success: false, error: "Método de pago requerido" });
    }

    // 1. Obtener carrito - CONSULTA SIMPLIFICADA
    console.log("2. 🛒 Consultando carrito...");
    const cartResult = await pool.query(`
      SELECT 
        ci.quantity as cart_quantity,
        p.available_qty as stock,
        p.name,
        p.id as product_id,
        p.farmer_id,
        p.price_per_kg
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `, [userId]);

    console.log("3. 📊 Resultado carrito:", cartResult.rows);

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ success: false, error: "Carrito vacío" });
    }

    // 2. Validación de stock - SUPER SIMPLE
    console.log("4. 🔎 Validando stock...");
    const item = cartResult.rows[0];
    
    console.log("5. 📦 Item:", {
      nombre: item.name,
      stock: item.stock,
      carrito: item.cart_quantity,
      stock_tipo: typeof item.stock,
      carrito_tipo: typeof item.cart_quantity
    });

    // Conversión EXPLÍCITA y comparación
    const stockNum = Number(item.stock);
    const cartNum = Number(item.cart_quantity);
    
    console.log("6. 🔢 Después de conversión:", {
      stockNum, 
      cartNum,
      comparacion: stockNum >= cartNum
    });

    if (stockNum < cartNum) {
      console.log("7. ❌ STOCK INSUFICIENTE - VALORES:", { stockNum, cartNum });
      return res.status(400).json({ 
        success: false, 
        error: `Stock insuficiente para ${item.name}`,
        debug: {
          stock: stockNum,
          carrito: cartNum,
          diferencia: stockNum - cartNum
        }
      });
    }

    console.log("8. ✅ Stock válido - Creando orden...");

    // 3. Crear orden simple
    const orderResult = await pool.query(
      `INSERT INTO orders 
       (consumer_id, farmer_id, total_amount, payment_method, shipping_address) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [userId, item.farmer_id, cartNum * item.price_per_kg, payment_method, shipping_address]
    );

    const orderId = orderResult.rows[0].id;
    console.log("9. ✅ Orden creada ID:", orderId);

    // 4. Crear order_item
    await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) 
       VALUES ($1, $2, $3, $4)`,
      [orderId, item.product_id, item.cart_quantity, item.price_per_kg]
    );

    // 5. Actualizar stock
    await pool.query(
      "UPDATE products SET available_qty = available_qty - $1 WHERE id = $2",
      [item.cart_quantity, item.product_id]
    );

    // 6. Vaciar carrito
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

    console.log("10. 🎉 ORDEN COMPLETADA EXITOSAMENTE!");

    res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
      order_id: orderId,
      total: (cartNum * item.price_per_kg).toFixed(2)
    });

  } catch (error: any) {
    console.error("💥 ERROR CRÍTICO:", error.message);
    console.error("Stack:", error.stack);
    
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      debug: error.message
    });
  }
};


// Obtener órdenes del consumer
const getConsumerOrders = async (req: any, res: any) => {
  try {
    const userId = req.userId;

    const result = await pool.query(`
      SELECT 
        o.*,
        u.name as farmer_name,
        u.district as farmer_district,
        u.city as farmer_city,
        COUNT(oi.id) as items_count
      FROM orders o
      JOIN users u ON o.farmer_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.consumer_id = $1
      GROUP BY o.id, u.name, u.district, u.city
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      count: result.rows.length,
      orders: result.rows
    });

  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Obtener órdenes recibidas por farmer
const getFarmerOrders = async (req: any, res: any) => {
  try {
    const farmerId = req.userId;

    const result = await pool.query(`
      SELECT 
        o.*,
        u.name as consumer_name,
        u.district as consumer_district,
        u.city as consumer_city,
        COUNT(oi.id) as items_count
      FROM orders o
      JOIN users u ON o.consumer_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.farmer_id = $1
      GROUP BY o.id, u.name, u.district, u.city
      ORDER BY o.created_at DESC
    `, [farmerId]);

    res.json({
      success: true,
      count: result.rows.length,
      orders: result.rows
    });

  } catch (error) {
    console.error("Error obteniendo órdenes recibidas:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Obtener detalle de una orden específica
const getOrderDetail = async (req: any, res: any) => {
  try {
    const orderId = req.params.id;
    const userId = req.userId;
    const userRole = req.userRole;

    // Verificar permisos
    const orderCheck = await pool.query(
      `SELECT * FROM orders 
       WHERE id = $1 AND (consumer_id = $2 OR farmer_id = $2)`,
      [orderId, userId]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Orden no encontrada"
      });
    }

    const order = orderCheck.rows[0];

    // Obtener items de la orden
    const itemsResult = await pool.query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [orderId]);

    // Obtener información del otro usuario
    const otherUserId = userRole === 'consumer' ? order.farmer_id : order.consumer_id;
    const otherUserResult = await pool.query(
      "SELECT name, district, city, email FROM users WHERE id = $1",
      [otherUserId]
    );

    res.json({
      success: true,
      order: {
        ...order,
        items: itemsResult.rows,
        other_user: otherUserResult.rows[0]
      }
    });

  } catch (error) {
    console.error("Error obteniendo detalle de orden:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

// Actualizar estado de la orden (solo farmer)
const updateOrderStatus = async (req: any, res: any) => {
  try {
    const orderId = req.params.id;
    const farmerId = req.userId;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'in-transit', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Estado válido es requerido: pending, confirmed, in-transit, delivered, cancelled"
      });
    }

    // Verificar que la orden pertenece al farmer
    const orderCheck = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND farmer_id = $2",
      [orderId, farmerId]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Orden no encontrada"
      });
    }

    // Actualizar estado
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, orderId]
    );

    res.json({
      success: true,
      message: "Estado de orden actualizado exitosamente",
      order: result.rows[0]
    });

  } catch (error) {
    console.error("Error actualizando estado de orden:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

module.exports = {
  createOrder,
  getConsumerOrders,
  getFarmerOrders,
  getOrderDetail,
  updateOrderStatus
};