import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import DataModel from "@/models/Data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    switch (req.method) {
      case "GET":  // READ
        {
          const data = await DataModel.find({});
          return res.status(200).json(data);
        }

      case "POST":  // CREATE
        {
          const { name, description } = req.body;
          if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
          }
          const newData = await DataModel.create({ name, description });
          return res.status(201).json(newData);
        }

      case "PUT":  // UPDATE
        {
          const { id, name, description } = req.body;
          if (!id || !name || !description) {
            return res.status(400).json({ message: "ID, Name, and Description are required" });
          }
          const updatedData = await DataModel.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
          );
          if (!updatedData) {
            return res.status(404).json({ message: "Data not found" });
          }
          return res.status(200).json(updatedData);
        }

      case "DELETE":  // DELETE
        {
          const { id } = req.body;
          if (!id) {
            return res.status(400).json({ message: "ID is required for deletion" });
          }
          const deletedData = await DataModel.findByIdAndDelete(id);
          if (!deletedData) {
            return res.status(404).json({ message: "Data not found" });
          }
          return res.status(200).json({ message: "Data deleted successfully" });
        }

      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
