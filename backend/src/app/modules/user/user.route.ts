import express, { Router } from "express";
import { UserControllers } from "./user.controller";

const router: Router = express.Router();

router.post("/create-user", UserControllers.createUser);
router.post("/find-user", UserControllers.getUsers);
router.get("/search-user", UserControllers.searchUsers);

export const UserRouter = router;
