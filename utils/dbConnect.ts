import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env.local");
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "nextCrudDB",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

export default dbConnect;
