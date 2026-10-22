import { body, param } from "express-validator";
import { validator } from "../validator.middleware.js";
import { DirectorModel } from "../../models/director.model.js";
import { ActorModel } from "../../models/actor.model.js";
import { MovieModel } from "../../models/movie.model.js";

export const createMovieValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título de la película es obligatorio"),

  body("releaseYear")
    .isInt({ min: 1888 })
    .withMessage("El año de estreno debe ser 1888 o posterior"),

  body("genre")
    .trim()
    .notEmpty()
    .withMessage("El género es obligatorio"),

  body("duration")
    .isInt({ min: 1 })
    .withMessage("La duración debe ser de al menos 1 minuto"),

  // Validamos que el ID del director exista y esté activo en la base de datos
  body("director")
    .isMongoId()
    .withMessage("El ID del director no es válido")
    .custom(async (directorId) => {
      const director = await DirectorModel.findOne({ _id: directorId, isActive: true });
      if (!director) {
        throw new Error("El director especificado no existe");
      }
      return true;
    }),

  // Validamos si envían actores inicialmente en la creación
  body("actors")
    .optional({ values: "falsy" })
    .isArray()
    .withMessage("Los actores deben ser una lista de IDs")
    .custom(async (actorIds) => {
      for (const actorId of actorIds) {
        const actor = await ActorModel.findOne({ _id: actorId, isActive: true });
        if (!actor) {
          throw new Error(`El actor con ID ${actorId} no existe o está inactivo`);
        }
      }
      return true;
    }),
  validator,

];

export const updateMovieValidation = [
  body("title")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("El título no puede estar vacío"),

  body("releaseYear")
    .optional({ values: "falsy" })
    .isInt({ min: 1888 })
    .withMessage("El año de estreno no es válido"),

  body("genre")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("El género no puede estar vacío"),

  body("duration")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("La duración debe ser de al menos 1 minuto"),

  body("director")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("El ID del director no es válido")
    .custom(async (directorId) => {
      const director = await DirectorModel.findOne({ _id: directorId, isActive: true });
      if (!director) {
        throw new Error("El director especificado no existe o está inactivo");
      }
      return true;
    }),

  validator,

];

//esto es para vincular un actor a una película
export const addActorToMovieValidation = [
  // validamos el id de la película que viene en el parámetro
  param("id")
    .isMongoId()
    .withMessage("El ID de la película no es válido"),

  // Validamos el id del actor en el cuerpo de la petición
  body("actorId")
    .isMongoId()
    .withMessage("El ID del actor no es válido")
    .custom(async (actorId, { req }) => {

      // primero se verifica que la película exista
      const movie = await MovieModel.findOne({ _id: req.params.id, isActive: true });

      if (!movie) {
        throw new Error("La película no existe");
      }

      // despues nos fijamos que el actor exista
      const actor = await ActorModel.findOne({ _id: actorId, isActive: true });

      if (!actor) {
        throw new Error("El actor no existe o está inactivo");
      }

      // Y por ultimo nos fijamos si este actor se encuentra agregado a este pelicula
      const isAlreadyAdded = movie.actors.some((id) => id.toString() === actorId);
      if (isAlreadyAdded) {
        throw new Error("Este actor ya está vinculado a la película");
      }
      return true;
    }),

  validator,

];