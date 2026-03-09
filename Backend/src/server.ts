import app from "./app";
import main from "./config/db";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;
main();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});