import { matchedData } from "express-validator";
import { MovieModel } from "../models/movie.model.js";

//Crear una Película (POST)
export const createMovie = async (req, res) => {
  try {
    // matchedData obtiene solo los campos validados (title, releaseYear, genre, duration, director, etc.)
    const validatedData = matchedData(req);

    //Creamos la película en la base de datos
    const newMovie = await MovieModel.create(validatedData);

    return res.status(201).json({
      msg: "Película creada exitosamente",
      data: newMovie,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al crear la película",
      error: error.message,
    });
  }
};

//Obtener todas las películas activas con populate múltiple (GET)
export const getAllMovies = async (req, res) => {
  try {
    // populate('director') trae los datos del director (Relación 1:N)
    // populate('actors') trae los datos de los actores vinculados (Relación N:M)
    // El segundo parámetro ("name nationality...") selecciona solo los campos que queremos mostrar (proyección)
    const movies = await MovieModel.find({ isActive: true })
      .populate("director", "name nationality contact")
      .populate("actors", "name birthYear nationality");

    return res.status(200).json({
      msg: "Películas obtenidas correctamente",
      total: movies.length,
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener las películas",
      error: error.message,
    });
  }
};

//Obtener una película por ID con sus relaciones (GET)
export const getMovieById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const movie = await MovieModel.findOne({ _id: id, isActive: true })
      .populate("director", "name nationality contact")
      .populate("actors", "name birthYear nationality");

    if (!movie) {
      return res.status(404).json({
        msg: "Película no encontrada o inactiva",
      });
    }

    return res.status(200).json({
      msg: "Película encontrada",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al buscar la película",
      error: error.message,
    });
  }
};

//Actualizar datos de una película (PUT)
export const updateMovie = async (req, res) => {
  try {
    const { id, ...dataToUpdate } = matchedData(req);

    const updatedMovie = await MovieModel.findOneAndUpdate(
      { _id: id, isActive: true },
      dataToUpdate,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({
        msg: "Película no encontrada para actualizar",
      });
    }

    return res.status(200).json({
      msg: "Película actualizada correctamente",
      data: updatedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al actualizar la película",
      error: error.message,
    });
  }
};

//Eliminación lógica de una película (DELETE)
export const deleteMovie = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Desactivamos lógicamente la película cambiando isActive a false
    const deletedMovie = await MovieModel.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!deletedMovie) {
      return res.status(404).json({
        msg: "Película no encontrada o ya eliminada",
      });
    }

    return res.status(200).json({
      msg: "Película eliminada lógicamente con éxito",
      data: deletedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al eliminar la película",
      error: error.message,
    });
  }
};

// ndpoint de relación N:M: Agregar un nuevo actor al reparto (POST)
export const addActorToMovie = async (req, res) => {
  try {
    // matchedData extrae el 'id' de la película y el 'actorId' del body
    const { id, actorId } = matchedData(req);

    // Usamos el operador atómico $addToSet de MongoDB:
    // Agrega el 'actorId' al arreglo 'actors' SOLO si todavía no existe en él
    const updatedMovie = await MovieModel.findByIdAndUpdate(
      id,
      { $addToSet: { actors: actorId } },
      { new: true }
    ).populate("actors", "name birthYear nationality");

    return res.status(200).json({
      msg: "Actor vinculado exitosamente al reparto de la película",
      data: updatedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al vincular el actor a la película",
      error: error.message,
    });
  }
};