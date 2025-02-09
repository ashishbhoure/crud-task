import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const DataModel = mongoose.models.Data || mongoose.model("Data", DataSchema);

export default DataModel;
