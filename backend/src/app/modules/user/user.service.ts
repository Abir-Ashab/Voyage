import { User } from "./user.interface";
import { UserModel } from "./user.model";

const createUserIntoDB = async (user: User) => {
  const result = await UserModel.create(user);
  return result;
};

const getUserByEmail = async ({ email }: { email: string }) => {
  const result = await UserModel.findOne({ email: email });
  return result;
};

const getUserByEmailOnly = async ({ email }: { email: string }) => {
  const result = await UserModel.findOne({ email: email });
  return result;
};

// Service function to search for a user by username or email
export const findUserBySearchKey = async (searchKey: string) => {
  try {
    // Find the user by matching username or email
    const users = await UserModel.find({
      $or: [
        { username: new RegExp(searchKey, "i") }, // Case-insensitive search for username
        { email: new RegExp(searchKey, "i") }, // Case-insensitive search for email
      ],
    });

    return users;
  } catch (error) {
    throw new Error("Error while fetching the user");
  }
};

const searchUsersByName = async (searchKey: string) => {
  // Perform the search in the database
  return await UserModel.find({
    name: { $regex: searchKey, $options: "i" },
  }).select("name");
};

export const UserServices = {
  createUserIntoDB,
  getUserByEmail,
  getUserByEmailOnly,
  findUserBySearchKey,
  searchUsersByName,
};
