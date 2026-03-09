import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {

    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists"
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (role automatically guest)
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "local",
      role: "guest"
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error: any) {

    // Mongo duplicate key fallback
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Email already registered"
      });
      return;
    }

    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const loginUser = async (req:Request, res:Response): Promise<void> => {
    try {
      
    } catch (error) {
        
    }
}
export { registerUser, loginUser };
