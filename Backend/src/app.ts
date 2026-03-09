import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

export default app;