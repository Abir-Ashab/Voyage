import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { User } from "./user.interface";

const createUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const { email, username } = user;
    if (!email || !username) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required." });
    }

    const existingAccounts = await UserServices.getUserByEmailOnly({ email });
    if (existingAccounts) {
      return res
        .status(400)
        .json({ success: false, message: "This email is already registered." });
    }

    const result = await UserServices.createUserIntoDB(user);
    console.log("User data: ", user);
    res.status(200).json({
      success: true,
      message: "New user created successfully",
      data: result,
    });
  } catch (err) {
    console.log("Error ocurred while creating new user: ", err);
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await UserServices.getUserByEmail({ email });
    if (!result) {
      return res.status(200).json({
        authSuccess: false,
        message: "No user found with these credentials.",
        data: null,
      });
    }
    res.status(200).json({
      authSuccess: true,
      message: "User data fetched successfully.",
      data: result,
    });
  } catch (err) {
    console.log("Error occurred while fetching user info: ", err);
  }
};

// Controller function to handle search user requests
const searchUsers = async (req: Request, res: Response) => {
  try {
    // Extract search key from the query parameters
    const searchKey: string = req.query.searchKey as string;

    // Validate if search key is provided
    if (!searchKey || searchKey.trim() === "") {
      return res.status(400).json({ message: "Search key is required" });
    }

    // Call the service to search users
    const users = await UserServices.searchUsersByName(searchKey);

    // If no users are found
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the found users
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error while searching for users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// New Controller function to handle update user requests
// const updateUser = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params; // Get the userId from the route params
//     const updateData: Partial<User> = req.body; // Partial data to update

//     // Check if the user exists
//     const existingUser = await UserServices.getUserById(userId);
//     if (!existingUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Call service to update user details
//     const updatedUser = await UserServices.updateUser(userId, updateData);

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser,
//     });
//   } catch (err) {
//     console.error("Error while updating user:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const UserControllers = {
  createUser,
  getUsers,
  searchUsers,
};
