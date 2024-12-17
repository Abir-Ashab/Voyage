// tripDetail.controller.ts
import { Request, Response } from "express";
import {
  createTripDetailService,
  getTripDetailsService,
  updateTripDetailService,
  deleteTripDetailService,
  findTripDetailsByUserId,
  addTripDetailAsTextService,
} from "./tripDetail.service";

// Controller to create a new TripDetail
const createTripDetail = async (req: Request, res: Response) => {
  try {
    const tripDetailData = req.body; // Assumes body contains a valid TripDetail object
    const newTripDetail = await createTripDetailService(tripDetailData);
    res.status(201).json({
      success: true,
      message: "Trip detail created successfully",
      data: newTripDetail,
    });
  } catch (err) {
    console.error("Error creating trip detail:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTripDetails = async (req: Request, res: Response) => {
  try {
    const tripDetails = await getTripDetailsService();
    res.status(200).json({
      success: true,
      data: tripDetails,
    });
  } catch (err) {
    console.error("Error fetching trip details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addTripDetailAsText = async (req: Request, res: Response) => {
  try {
    const { userId, requirementsId, details } = req.body; // Assuming the text is sent in the request body

    // Validate input
    if (!details || typeof details !== "string") {
      return res
        .status(400)
        .json({ error: "Text is required and must be a string" });
    }

    // Call service to add trip detail
    const tripDetail = await addTripDetailAsTextService(
      userId,
      requirementsId,
      details
    );

    // Send response
    res.status(201).json({
      message: "Trip detail saved successfully",
      tripDetail,
    });
  } catch (error) {
    console.error("Error saving trip detail:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the trip detail" });
  }
};

export const getTripDetailsByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.query.userId as string;

  if (!userId) {
    res.status(400).json({ message: "userId is required" });
    return;
  }

  try {
    const tripDetails = await findTripDetailsByUserId(userId);

    if (!tripDetails) {
      res.status(404).json({ message: "Trip details not found for this user" });
    } else {
      res.status(200).json(tripDetails);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trip details", error });
  }
};

// Controller to update an existing TripDetail
const updateTripDetail = async (req: Request, res: Response) => {
  try {
    const { tripDetailId } = req.params; // Assumes the tripDetailId is in the URL parameters
    const updateData = req.body;

    const updatedTripDetail = await updateTripDetailService(
      tripDetailId,
      updateData
    );
    if (!updatedTripDetail) {
      return res.status(404).json({ message: "Trip detail not found" });
    }

    res.status(200).json({
      success: true,
      message: "Trip detail updated successfully",
      data: updatedTripDetail,
    });
  } catch (err) {
    console.error("Error updating trip detail:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to delete a TripDetail
const deleteTripDetail = async (req: Request, res: Response) => {
  try {
    const { tripDetailId } = req.params; // Assumes the tripDetailId is in the URL parameters

    const deletedTripDetail = await deleteTripDetailService(tripDetailId);
    if (!deletedTripDetail) {
      return res.status(404).json({ message: "Trip detail not found" });
    }

    res.status(200).json({
      success: true,
      message: "Trip detail deleted successfully",
      data: deletedTripDetail,
    });
  } catch (err) {
    console.error("Error deleting trip detail:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const TripDetailControllers = {
  createTripDetail,
  addTripDetailAsText,
  getTripDetails,
  updateTripDetail,
  deleteTripDetail,
  getTripDetailsByUserId,
};
