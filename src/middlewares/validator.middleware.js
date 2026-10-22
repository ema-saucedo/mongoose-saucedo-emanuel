import { validationResult } from "express-validator"

export const validator = (req, res, next) => {
    //acá guardamos los resultados de las validaciones ejecutadas previamente en la ruta (Esto seria como nuestro array de errores)
    const result = validationResult(req);
    //si el array de errores no está vacío, significa que fallo una de las reglas
    if (!result.isEmpty()){
        //y retornamos un codigo 400 y enviamos los errores con mapped para que se vean mas ordenos y limpios.
        return res.status(400).json({errors: result.mapped()});
    }
//Si no hay errores, dejamos que avance la petición al controlador
    next();
};