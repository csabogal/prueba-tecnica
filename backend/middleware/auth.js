const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log("Middleware de autenticación ejecutándose");
  const authHeader = req.header("Authorization");
  console.log("Encabezado de autorización:", authHeader);

  if (!authHeader) {
    console.log("No se proporcionó encabezado de autorización");
    return res.status(401).json({ msg: "No hay token, autorización denegada" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("No se proporcionó token en el encabezado de autorización");
    return res
      .status(401)
      .json({ msg: "Formato de token inválido, autorización denegada" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    console.error("Error al verificar el token:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expirado" });
    }
    res.status(401).json({ msg: "Token no válido" });
  }
};
