import { body } from "express-validator";
import { validator } from "../validator.middleware.js";

export const createDirectorValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del director es obligatorio"),

  body("nationality")
    .trim()
    .notEmpty()
    .withMessage("La nacionalidad es obligatoria"),

  body("contact.email")
    .trim()
    .notEmpty()
    .withMessage("El email de contacto es obligatorio")
    .isEmail()
    .withMessage("Debe ser un email válido"),

  body("contact.phone")
    .optional({ values: "falsy" }) // con el falsy hacemos que si viene vacío solo lo va a ignorar y se saltea todas las validaciones del campo
    .trim(),

  body("contact.website").optional({ values: "falsy" }).trim(),
  //el middlewares que verifica si hubo errores
  validator,
];

export const updateDirectorValidation = [
  body("name")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),

  body("nationality")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("La nacionalidad no puede estar vacía"),

  body("contact.email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("Debe ser un email válido"),

  body("contact.phone").optional({ values: "falsy" })
  .trim(),

  body("contact.website").optional({ values: "falsy" })
  .trim(),
  validator,
];
