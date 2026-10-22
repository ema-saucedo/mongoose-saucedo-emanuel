import { model, Schema } from "mongoose";

const directorSchema = new Schema(
  {
    name: {
        type:String,
        required:true,
        trim:true,
    },
    nationality: {
        type:String,
        required:true,
        trim:true,
    },
    contact: {
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// VIRTUAL POPULATE
//Esta primera línea crea una propiedad virtual llamada movies dentro del documento de director
directorSchema.virtual("movies", {
//Esta ref le dice a mongoose en que coleccion tiene que ir a buscar la informacion
    ref:"Movie",
//Esto indica el dato que se va a usar para hacer el match, en este caso seria el id del director    
    localField:"_id",
//Esto indica en que propiedad del modelo Movie esta guardado el ID del director
    foreignField: "director",
});

export const DirectorModel = model("Director", directorSchema); 