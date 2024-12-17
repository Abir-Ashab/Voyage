import { Requirement } from "./requirement.interface";
import { RequirementModel } from "./requirement.model";

const createRequirementIntoDB = async (requirement: Requirement) => {
  const result = await RequirementModel.create(requirement);
  return result;
};

const getRequirementById = async ({ id }: { id: string }) => {
  const result = await RequirementModel.findById(id);
  return result;
};

export const getRequirementsByUserId = async (userId: string) => {
  const results = await RequirementModel.find({ userId });
  return results;
};

const getAllRequirements = async () => {
  const result = await RequirementModel.find();
  return result;
};

const deleteRequirementById = async ({ id }: { id: string }) => {
  const result = await RequirementModel.findByIdAndDelete(id);
  return result;
};

const updateRequirementById = async (
  id: string,
  updateData: Partial<Requirement>
) => {
  const result = await RequirementModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return result;
};

export const RequirementServices = {
  createRequirementIntoDB,
  getRequirementById,
  getAllRequirements,
  deleteRequirementById,
  updateRequirementById,
  getRequirementsByUserId,
};
