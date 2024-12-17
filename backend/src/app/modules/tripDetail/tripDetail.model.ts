import { TripDetail } from "./tripDetail.interface";
import { Model, Schema, model } from "mongoose";

const mongoose = require("mongoose");

// Define the Activity schema
const activitySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  place: {
    type: String,
    required: false,
  },
  proTip: {
    type: String,
    required: false,
  },
});

// Define the Itinerary schema
const itinerarySchema = new mongoose.Schema({
  place: {
    type: String,
    required: false,
  },
  dayNo: {
    type: Number,
    required: false,
  },
  imageDBName: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});

// Define the TripDetail schema
const tripDetailSchema = new mongoose.Schema({
  userId: {
    type: String, // You can also use mongoose.Schema.Types.ObjectId if it refers to a user in another collection
    required: false,
  },
  requirementsId: {
    type: String, // Same here, ObjectId can be used if referring to another collection
    required: false,
  },
  checkedItineraries: [itinerarySchema],
  suggestedActivities: [activitySchema],
  details: {
    type: String,
    required: true
  }
});

// Create the TripDetail model
export const TripDetailModel = model<TripDetail>(
  "TripDetail",
  tripDetailSchema
);
