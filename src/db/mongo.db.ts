import { connect } from "mongoose";
import { MONGODB_CONNECTION_STRING } from "../constants";

const connectMongoDB = async () => {
  try {
    const connectionInstance = await connect(MONGODB_CONNECTION_STRING);
    console.log(
      `MongoDB Connected !! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection Failed: ", error);
    process.exit(1);
  }
};

export default connectMongoDB;
