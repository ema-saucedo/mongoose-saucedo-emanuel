import { Router } from "express";
import {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controller.js";
import {
  createProfileValidation,
  updateProfileValidation,
} from "../middlewares/validations/profile.validation.js";
import { idParamValidation } from "../middlewares/validations/id.validation.js";

const profileRouter = Router();

profileRouter.post("/", createProfileValidation, createProfile);
profileRouter.get("/", getAllProfiles);
profileRouter.get("/:id", idParamValidation, getProfileById);
profileRouter.put("/:id", idParamValidation, updateProfileValidation, updateProfile);
profileRouter.delete("/:id", idParamValidation, deleteProfile);

export default profileRouter;