import express, { Router } from "express";
import * as RequirementControllers from "./requirement.controller";

const router: Router = express.Router();

router.post("/save-requirement", RequirementControllers.createRequirement);
router.get("/get-requirements", RequirementControllers.getAllRequirements);
router.get("/get-requirements", RequirementControllers.getRequirementsByUId);
router.get("/get-requirements/:id", RequirementControllers.getRequirementById);
router.put("/:id", RequirementControllers.updateRequirementById);

// DELETE: Remove a requirement by ID
// router.delete("/:id", RequirementControllers.deleteRequirementById);

export const RequirementRouter = router;
