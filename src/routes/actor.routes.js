import { Router } from "express";
import {
  createActor,
  getAllActors,
  getActorById,
  updateActor,
  deleteActor,
} from "../controllers/actor.controller.js";
import {
  createActorValidation,
  updateActorValidation,
} from "../middlewares/validations/actor.validation.js";
import { idParamValidation } from "../middlewares/validations/id.validation.js";

const actorRouter = Router();

actorRouter.post("/", createActorValidation, createActor);
actorRouter.get("/", getAllActors);
actorRouter.get("/:id", idParamValidation, getActorById);
actorRouter.put("/:id", idParamValidation, updateActorValidation, updateActor);
actorRouter.delete("/:id", idParamValidation, deleteActor);

export default actorRouter;