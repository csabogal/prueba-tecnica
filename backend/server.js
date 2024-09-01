const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

// Configurar CORS
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado exitosamente"))
  .catch((err) => {
    console.error("Error detallado al conectar a MongoDB:", err);
    process.exit(1);
  });

// Rutas
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

const searchRoutes = require("./routes/Search");
app.use("/api/search", searchRoutes);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "/")));

// Manejador para ruta raiz
app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
