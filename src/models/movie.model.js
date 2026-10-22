import { model, Schema, Types } from "mongoose";

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    releaseYear: {
      type: Number,
      required: true,
      min: 1888,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    //esta relacion es 1:N ("uno a muchos")
    director: {
      type: Types.ObjectId, //esto guarda un id de mongodb
      ref: "Director", //esto le dice a mongoose que el id de arriba le pertenece a la coleccion director
      required: true, //y esto es que no te deja guardar la pelicula si este campo esta vacio
    },
    //esta otra relacion es N:M ("Muchos a Muchos")
    actors: [
      {
        type: Types.ObjectId, //esto es lo mismo que el anterior, que cada elemento de este array va a ser un id de mongo
        ref: "Actor", //y que estos id son de la coleccion de actor
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const MovieModel = model("Movie", movieSchema);
