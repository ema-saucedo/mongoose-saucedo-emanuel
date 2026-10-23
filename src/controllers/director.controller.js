import { matchedData } from "express-validator";

import { DirectorModel } from "../models/director.model";
import { ProfileModel } from "../models/profile.model";
import { MovieModel } from "../models/movie.model";

//Crear director "POST"
export const createDirector = async (req, res) => {
  try {
    // matchedData extrae únicamente los campos que pasaron la validación previa
    const validatedData = matchedData(req);
    // Creamos el nuevo registro en la base de datos
    const newDirector = await DirectorModel.create(validatedData);

    return res.status(201).json({
      msg: "Director creado correctamente",
      data: newDirector,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error interno del servidor", error: error.message });
  }
};

//Obtener todos los directores "GET"
export const getAllDirectors = async (req, res) => {
  try {
    // Filtramos solo los que tengan isActive: true (borrado lógico)
    // .populate("movies") utiliza el virtual populate que definiste en el modelo
    const directors = await DirectorModel.find({ isActive: true }).populate(
      "movies",
    );
    // 200 OK: consulta exitosa
    return res.status(200).json({
      msg: "Directores obtenidos correctamente",
      total: directors.length,
      data: directors,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener los directores",
      error: error.message,
    });
  }
};
//Obtener director por ID "GET"
export const getDirectorById = async (req, res) => {
  try {
    // Obtenemos el id ya validado por idParamValidation
    const { id } = matchedData(req);
    // Buscamos que coincida el _id y que esté activo
    const director = await DirectorModel.findOne({ _id: id, isActive: true }).populate("movies");
    // Si no existe o tiene isActive: false, respondemos 404 Not Found
    if (!director) {
      return res.status(404).json({
        msg: "Director no encontrado o inactivo",
      });
    }
    return res.status(200).json({
      msg: "Director encontrado",
      data: director,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al buscar el director",
      error: error.message,
    });
  }
};
//Actualizar director "PUT"
export const updateDirector = async (req, res) => {
  try {
    // Separamos el 'id' de la ruta del resto de campos a modificar
    const { id, ...dataToUpdate } = matchedData(req);
    // new: true devuelve el documento con los datos actualizados
    const updatedDirector = await DirectorModel.findOneAndUpdate(
      { _id: id, isActive: true },
      dataToUpdate,
      { new: true }
    );
    if (!updatedDirector) {
      return res.status(404).json({
        msg: "Director no encontrado para actualizar",
      });
    }
    return res.status(200).json({
      msg: "Director actualizado correctamente",
      data: updatedDirector,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al actualizar el director",
      error: error.message,
    });
  }
};
// Eliminar director "DELETE"
export const deleteDirector = async (req, res) => {
  try {
    const { id } = matchedData(req);
    // Desactivamos lógicamente al director (isActive: false)
    const deletedDirector = await DirectorModel.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!deletedDirector) {
      return res.status(404).json({
        msg: "Director no encontrado o ya eliminado",
      });
    }
    // (Cascada 1:1): Desactivamos el perfil asociado a este director
    await ProfileModel.updateMany({ director: id }, { isActive: false });
    // (Cascada 1:N): Desactivamos todas las películas dirigidas por él
    await MovieModel.updateMany({ director: id }, { isActive: false });
    return res.status(200).json({
      msg: "Director y sus registros vinculados (perfil y películas) eliminados lógicamente en cascada",
      data: deletedDirector,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al eliminar el director",
      error: error.message,
    });
  }
};