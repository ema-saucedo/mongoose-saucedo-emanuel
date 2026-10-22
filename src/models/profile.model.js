import { model, Schema, Types } from "mongoose";

const profileSchema = new Schema(
  {
    //Relación 1:1, Esta es una referencia directa y única al director
    director: {
      type: Types.ObjectId, //esto es el tipo objectid de mongodb
      ref: "Director", //Esta es la referencia a la coleccion director
      required: true, //Es obligatorio asociar un perfil con un director
      unique: true, //Esto nos asegura que sea 1 a 1
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    awards: [
      {
        type: String,
        trim: true,
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

export const ProfileModel = model("Profile", profileSchema);
