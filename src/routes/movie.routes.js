import { Router } from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  addActorToMovie,
} from "../controllers/movie.controller.js";
import {
  createMovieValidation,
  updateMovieValidation,
  addActorToMovieValidation,
} from "../middlewares/validations/movie.validation.js";
import { idParamValidation } from "../middlewares/validations/id.validation.js";

const movieRouter = Router();

// CRUD normal de películas
movieRouter.post("/", createMovieValidation, createMovie);
movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", idParamValidation, getMovieById);
movieRouter.put("/:id", idParamValidation, updateMovieValidation, updateMovie);
movieRouter.delete("/:id", idParamValidation, deleteMovie);

// Endpoint de relación N:M: Agregar un actor al reparto
movieRouter.post("/:id/actors", addActorToMovieValidation, addActorToMovie);

export default movieRouter;