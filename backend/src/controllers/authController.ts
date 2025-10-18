const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta";

// Registrar nuevo usuario
const register = async (req: any, res: any) => {
  try {
    const { name, email, password, role, district, city } = req.body;

    // Validar campos requeridos
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        error: "Todos los campos son requeridos" 
      });
    }

    // Validar que el rol sea válido
    if (!["farmer", "consumer"].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        error: "Rol debe ser 'farmer' o 'consumer'" 
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: "El usuario ya existe" 
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar nuevo usuario
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, district, city) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, role, district, city, created_at`,
      [name, email, hashedPassword, role, district, city]
    );

    const newUser = result.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        district: newUser.district,
        city: newUser.city
      },
      token
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ 
      success: false, 
      error: "Error interno del servidor" 
    });
  }
};

// Login de usuario
const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: "Email y contraseña son requeridos" 
      });
    }

    // Buscar usuario
    const result = await pool.query(
      `SELECT id, name, email, password, role, district, city 
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: "Credenciales inválidas" 
      });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: "Credenciales inválidas" 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        city: user.city
      },
      token
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      success: false, 
      error: "Error interno del servidor" 
    });
  }
};

// Obtener perfil de usuario actual
const getProfile = async (req: any, res: any) => {
  try {
    // El userId viene del middleware de autenticación
    const userId = req.userId;

    const result = await pool.query(
      `SELECT id, name, email, role, district, city, created_at 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Usuario no encontrado" 
      });
    }

    const user = result.rows[0];
    
    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ 
      success: false, 
      error: "Error interno del servidor" 
    });
  }
};

// Exportar funciones
module.exports = {
  register,
  login,
  getProfile
};