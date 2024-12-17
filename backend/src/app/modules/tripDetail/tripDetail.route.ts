import { Router } from "express";
import { TripDetailControllers } from "./tripDetail.controller";

const router: Router = Router();

router.post("/add", TripDetailControllers.createTripDetail);
router.post("/details", TripDetailControllers.addTripDetailAsText);
router.get("/get", TripDetailControllers.getTripDetails);
router.get("/search", TripDetailControllers.getTripDetailsByUserId);
router.put("/update/:tripDetailId", TripDetailControllers.updateTripDetail);
router.delete("/delete/:tripDetailId", TripDetailControllers.deleteTripDetail);

export const TripDetailRouter = router;
