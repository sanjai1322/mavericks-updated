import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import type { Request, Response } from "express";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "mavericks-jwt-secret-key";
const SALT_ROUNDS = 10;

// Middleware to verify JWT token
export const verifyToken = async (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Register endpoint
router.post("/register", async (req: Request, res: Response) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUserByUsername = await storage.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingUserByEmail = await storage.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    // Create user
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Remove password from response
    const { password, ...userResponse } = user;
    
    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: "Registration failed", 
      error: error.message || "Unknown error"
    });
  }
});

// Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    // Find user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: "Login failed", 
      error: error.message || "Unknown error"
    });
  }
});

// Logout endpoint
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

// Get current user endpoint
router.get("/me", verifyToken, (req: Request, res: Response) => {
  const { password, ...userResponse } = (req as any).user;
  res.json(userResponse);
});

export default router;
