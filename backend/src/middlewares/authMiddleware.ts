const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta";

export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: "Token de acceso requerido" 
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        error: "Token inválido o expirado" 
      });
    }

    // Agregar información del usuario al request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  });
};

// Middleware para verificar si es farmer
const requireFarmer = (req: any, res: any, next: any) => {
  if (req.userRole !== "farmer") {
    return res.status(403).json({ 
      success: false, 
      error: "Se requieren permisos de agricultor" 
    });
  }
  next();
};

// Middleware para verificar si es consumer
const requireConsumer = (req: any, res: any, next: any) => {
  if (req.userRole !== "consumer") {
    return res.status(403).json({ 
      success: false, 
      error: "Se requieren permisos de consumidor" 
    });
  }
  next();
};

// Exportar todas las funciones
module.exports = {
  authenticateToken,
  requireFarmer,
  requireConsumer
};