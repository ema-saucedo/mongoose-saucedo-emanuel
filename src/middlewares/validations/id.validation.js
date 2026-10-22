import { param } from "express-validator";
import { validator } from "../validator.middleware.js";


export const idParamValidation = [
    param("id")
    .isMongoId()//Esto va a corroborar que si sea un id de MongoDB
    .withMessage("El ID es un objeto no válido"),
    validator, //Y acá ejecutamos el middleware que responde 400 si falla algo
];