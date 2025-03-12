import dotenv from "dotenv";
dotenv.config();
import { PORT } from "./constants";
import app from "./app";
import connectMongoDB from "./db/mongo.db";

(async () => {
  try {
    await connectMongoDB();
    app.on("error", (error) => console.error(`Server error: ${error}`));
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
  }
})();
