"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface IData {
    _id: string;
    name: string;
    description: string;
}

export default function CRUDTable() {
    const [data, setData] = useState<IData[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios.get("/api/crud")
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleAddOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editId) {
                await axios.put("/api/crud", { id: editId, name, description });
                setData(data.map((item) =>
                    item._id === editId ? { ...item, name, description } : item
                ));
            } else {
                const res = await axios.post("/api/crud", { name, description });
                setData([...data, res.data]);
            }

            setName("");
            setDescription("");
            setEditId(null);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const newData = data.filter((item) => item._id !== id);
        setData(newData);
        try {
            await axios.delete("/api/crud", { data: { id } });
        } catch (err) {
            console.error(err);
            setData(data);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">CRUD Table</h1>

            <form onSubmit={handleAddOrUpdate} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Name"
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter Description"
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-4 py-2 rounded-md text-white font-medium transition ${
                        isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {isLoading ? "Saving..." : editId ? "Update Record" : "Add Record"}
                </button>
            </form>

            {loading ? (
                <p className="text-center text-gray-500">Loading data...</p>
            ) : (
                <ul className="space-y-4">
                    {data.map((item) => (
                        <li key={item._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                            <div className="flex space-x-2 mt-3 md:mt-0">
                                <button
                                    onClick={() => {
                                        setEditId(item._id);
                                        setName(item.name);
                                        setDescription(item.description);
                                    }}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
