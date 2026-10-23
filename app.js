import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { startDB } from "./src/config/database.js";
import cookieParser from "cookie-parser";
import directorRouter from "./src/routes/director.routes.js";
import actorRouter from "./src/routes/actor.routes.js";
import movieRouter from "./src/routes/movie.routes.js";
import profileRouter from "./src/routes/profile.routes.js";

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

app.use("/api/directors", directorRouter);
app.use("/api/actors", actorRouter);
app.use("/api/movies", movieRouter);
app.use("/api/profiles", profileRouter);

// Conexión a la base de datos y encendido del servidor
app.listen(PORT, () => {
    startDB();
    console.log(`Servidor corriendo correctamente en el puerto ${PORT}`)
})