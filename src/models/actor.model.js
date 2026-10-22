import { model, Schema } from "mongoose";

const actorSchema = new Schema ({
    name:{
        type:String,
        required:true,
        trim:true
    },
    birthYear:{
        type:Number,
        required:true,
        min:1900
    },
    nationality:{
        type:String,
        required:true,
        trim:true
    },
    isActive: {
        type: Boolean,
        default: true
    },
},{
    timestamps:true,
    versionKey:false,
})

export const ActorModel = model("Actor",actorSchema);