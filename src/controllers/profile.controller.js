import { matchedData } from "express-validator";
import { ProfileModel } from "../models/profile.model.js";

// Crear Perfil (POST)
export const createProfile = async (req, res) => {
  try {
    // Obtenemos los campos validados (director, bio, yearsOfExperience, awards)
    const validatedData = matchedData(req);

    // Creamos el perfil vinculado al director
    const newProfile = await ProfileModel.create(validatedData);

    return res.status(201).json({
      msg: "Perfil creado exitosamente para el director",
      data: newProfile,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al crear el perfil",
      error: error.message,
    });
  }
};

// Obtener todos los perfiles activos con populate (GET)
export const getAllProfiles = async (req, res) => {
  try {
    // Populamos la información del director asociado (Relación 1:1)
    const profiles = await ProfileModel.find({ isActive: true }).populate(
      "director",
      "name nationality contact"
    );

    return res.status(200).json({
      msg: "Perfiles obtenidos correctamente",
      total: profiles.length,
      data: profiles,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener los perfiles",
      error: error.message,
    });
  }
};

// Obtener perfil por ID con populate (GET)
export const getProfileById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const profile = await ProfileModel.findOne({ _id: id, isActive: true }).populate(
      "director",
      "name nationality contact"
    );

    if (!profile) {
      return res.status(404).json({
        msg: "Perfil no encontrado o inactivo",
      });
    }

    return res.status(200).json({
      msg: "Perfil encontrado",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al buscar el perfil",
      error: error.message,
    });
  }
};

//Actualizar datos de un perfil (PUT)
export const updateProfile = async (req, res) => {
  try {
    const { id, ...dataToUpdate } = matchedData(req);

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { _id: id, isActive: true },
      dataToUpdate,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        msg: "Perfil no encontrado para actualizar",
      });
    }

    return res.status(200).json({
      msg: "Perfil actualizado correctamente",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al actualizar el perfil",
      error: error.message,
    });
  }
};

// Eliminación lógica de un perfil (DELETE)
export const deleteProfile = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Marcamos el perfil como inactivo (isActive: false)
    const deletedProfile = await ProfileModel.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!deletedProfile) {
      return res.status(404).json({
        msg: "Perfil no encontrado o ya eliminado",
      });
    }

    return res.status(200).json({
      msg: "Perfil eliminado lógicamente con éxito",
      data: deletedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al eliminar el perfil",
      error: error.message,
    });
  }
};