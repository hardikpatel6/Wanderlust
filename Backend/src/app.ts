import express, { Request, Response } from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("API Running");
});

export default app;