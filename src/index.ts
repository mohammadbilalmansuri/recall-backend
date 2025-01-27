import dotenv from "dotenv";
dotenv.config();
import { PORT } from "./constant.ts";
import app from "./app.ts";
import connectDB from "./db.ts";

(async () => {
  try {
    await connectDB();
    app.on("error", (error) => console.error(`Server error: ${error}`));
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
  }
})();
