import { matchedData } from "express-validator";
import { ActorModel } from "../models/actor.model.js";
import { MovieModel } from "../models/movie.model.js";

// Crear un Actor (POST)
export const createActor = async (req, res) => {
  try {
    // Obtenemos solo los campos que pasaron la validación previa
    const validatedData = matchedData(req);

    // Creamos el actor en MongoDB
    const newActor = await ActorModel.create(validatedData);

    return res.status(201).json({
      msg: "Actor creado correctamente",
      data: newActor,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al crear el actor",
      error: error.message,
    });
  }
};

//Obtener todos los actores activos (GET)
export const getAllActors = async (req, res) => {
  try {
    // Filtramos solo los que no fueron eliminados lógicamente
    const actors = await ActorModel.find({ isActive: true });

    return res.status(200).json({
      msg: "Actores obtenidos correctamente",
      total: actors.length,
      data: actors,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener los actores",
      error: error.message,
    });
  }
};

//Obtener un actor por su ID (GET) 
export const getActorById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const actor = await ActorModel.findOne({ _id: id, isActive: true });

    if (!actor) {
      return res.status(404).json({
        msg: "Actor no encontrado o inactivo",
      });
    }

    return res.status(200).json({
      msg: "Actor encontrado",
      data: actor,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al buscar el actor",
      error: error.message,
    });
  }
};

// 4. Actualizar datos de un actor (PUT)
export const updateActor = async (req, res) => {
  try {
    const { id, ...dataToUpdate } = matchedData(req);

    const updatedActor = await ActorModel.findOneAndUpdate(
      { _id: id, isActive: true },
      dataToUpdate,
      { new: true }
    );

    if (!updatedActor) {
      return res.status(404).json({
        msg: "Actor no encontrado para actualizar",
      });
    }

    return res.status(200).json({
      msg: "Actor actualizado correctamente",
      data: updatedActor,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al actualizar el actor",
      error: error.message,
    });
  }
};

//Eliminación lógica y desvinculación en cascada N:M (DELETE)
export const deleteActor = async (req, res) => {
  try {
    const { id } = matchedData(req);

    //Marcamos al actor como inactivo
    const deletedActor = await ActorModel.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!deletedActor) {
      return res.status(404).json({
        msg: "Actor no encontrado o ya eliminado",
      });
    }

    //CASCADA N:M
    // Usamos el operador $pull de MongoDB para sacar el ID del actor del arreglo 'actors'
    // en todas las películas donde estaba anotado
    await MovieModel.updateMany(
      { actors: id },
      { $pull: { actors: id } }
    );

    return res.status(200).json({
      msg: "Actor eliminado lógicamente y removido del reparto de sus películas",
      data: deletedActor,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al eliminar el actor",
      error: error.message,
    });
  }
};