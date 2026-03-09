import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { registerSchema } from "../validators/auth.validator";
import { loginSchema } from "../validators/auth.validator";
const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUser
);
router.post("/login", validate(loginSchema), loginUser);
export default router;