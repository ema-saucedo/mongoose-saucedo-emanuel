export const createActorValidation = [
   body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del actor es obligatorio"),

  body("birthYear")
    .isInt({ min: 1900 })
    .withMessage("El año de nacimiento debe ser un año válido desde 1900"),

  body("nationality")
    .trim()
    .notEmpty()
    .withMessage("La nacionalidad es obligatoria"),

  validator,
];

export const updateActorValidation = [
  body("name")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),

  body("birthYear")
    .optional({ values: "falsy" })
    .isInt({ min: 1900 })
    .withMessage("El año de nacimiento debe ser un número válido"),

  body("nationality")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("La nacionalidad no puede estar vacía"),

  validator,
];