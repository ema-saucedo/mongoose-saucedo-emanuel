import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { startDB } from "./src/config/database.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3005;

// Middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());

//Rutas
app.get("/", (req, res) => {
  res.json({ msg: "API funcionando correctamente" });
});

// Conexión a la base de datos y encendido del servidor
app.listen(PORT, () => {
    startDB();
    console.log(`Servidor corriendo correctamente en el puerto ${PORT}`)
})