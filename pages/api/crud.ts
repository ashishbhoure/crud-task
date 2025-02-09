import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import DataModel from "@/models/Data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case "GET":  // READ
      try {
        const data = await DataModel.find({});
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
      }
      break;

    case "POST":  // CREATE
      try {
        const { name, description } = req.body;
        const newData = await DataModel.create({ name, description });
        res.status(201).json(newData);
      } catch (error) {
        res.status(500).json({ message: "Error creating data" });
      }
      break;

    case "PUT":  // UPDATE
      try {
        const { id, name, description } = req.body;
        const updatedData = await DataModel.findByIdAndUpdate(id, { name, description }, { new: true });
        res.status(200).json(updatedData);
      } catch (error) {
        res.status(500).json({ message: "Error updating data" });
      }
      break;

    case "DELETE":  // DELETE
      try {
        const { id } = req.body;
        await DataModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Data deleted" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting data" });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
