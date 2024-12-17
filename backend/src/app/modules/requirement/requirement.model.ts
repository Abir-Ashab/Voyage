import { Model, Schema, model } from "mongoose";
import { Location, Requirement } from "./requirement.interface";

const locationSchema = new Schema<Location>({
  cityName: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

// Define the Requirement schema
const requirementSchema = new Schema<Requirement>({
  boardingPoint: {
    type: locationSchema,
    required: true,
  },
  destination: {
    type: locationSchema,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  ageConcern: {
    type: [String],
    required: true,
  },
  sinceWhen: {
    type: Date,
    required: true,
  },
  tillWhen: {
    type: Date,
    required: true,
  },
  budgetType: {
    type: String,
    required: true,
  },
  preferredActivities: {
    type: [String],
    required: true,
  },
  userId: {
    type: String, // You can change this to ObjectId if it's referring to a user in another collection
    required: true,
  },
});

// Create the Requirement model
export const RequirementModel = model<Requirement>(
  "Requirement",
  requirementSchema
);
