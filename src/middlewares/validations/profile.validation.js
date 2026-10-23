import { body } from "express-validator";
import { validator } from "../validator.middleware.js";
import { DirectorModel } from "../../models/director.model.js";
import { ProfileModel } from "../../models/profile.model.js";

export const createProfileValidation = [
    body("director")
    .isMongoId()
    .withMessage("El ID del director no es válido")
    .custom(async (directorId) => {
        //con esto buscamos si el director existe
        const director = await DirectorModel.findOne({_id:directorId, isActive:true});
        
        if(!director) {
            throw new Error("El director no existe o está inactivo");
        }

        //Si existe el director, vamos a ver que no tenga un perfil ya asignado(que esto asegura que nuestra relacion va a ser 1:1)

        const existingProfile = await ProfileModel.findOne({director:directorId,isActive:true});
        
        if (existingProfile) {
            throw new Error ("Este director ya tiene un perfil registrado");
        };
        return true;;
    }),

    body("bio")
    .trim()
    .notEmpty()
    .withMessage("La biografía es obligatoria"),

    body("yearsOfExperience")
    .isInt({ min: 0 })//esto dice que tiene que ser un número mayor o igual a 0
    .withMessage("Los años de experiencia deben ser un número positivo"),

    body("awards")
    .optional({ values: "falsy" })
    .isArray() //esto dice que awards tiene que ser un array
    .withMessage("Los premios deben ser una lista"),

    validator,
];

export const updateProfileValidation = [
  body("bio")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("La biografía no puede estar vacía"),

  body("yearsOfExperience")
    .optional({ values: "falsy" })
    .isInt({ min: 0 })
    .withMessage("Los años de experiencia deben ser un número positivo"),

  body("awards")
    .optional({ values: "falsy" })
    .isArray()
    .withMessage("Los premios deben enviarse dentro de un arreglo [ ]"),

  validator,
];