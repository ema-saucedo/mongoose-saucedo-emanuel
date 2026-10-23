import { Router } from "express";
import {
  createDirector,
  getAllDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
} from "../controllers/director.controller.js";
import {
  createDirectorValidation,
  updateDirectorValidation,
} from "../middlewares/validations/director.validation.js";
import { idParamValidation } from "../middlewares/validations/id.validation.js";

const directorRouter = Router();

// Rutas de colección
directorRouter.post("/", createDirectorValidation, createDirector);
directorRouter.get("/", getAllDirectors);

// Rutas individuales por ID
directorRouter.get("/:id", idParamValidation, getDirectorById);
directorRouter.put("/:id", idParamValidation, updateDirectorValidation, updateDirector);
directorRouter.delete("/:id", idParamValidation, deleteDirector);

export default directorRouter;