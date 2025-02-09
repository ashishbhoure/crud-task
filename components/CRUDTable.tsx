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

    //   if (loading) {
    //     return <div>Loading...</div>;
    //   }


    const handleAddOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("aksdkadjkjadkl")

        try {
            if (editId) {
                // Update existing record
                await axios.put("/api/crud", { id: editId, name, description });
                setData(data.map((item) =>
                    item._id === editId ? { ...item, name, description } : item
                ));
            } else {
                // Add new record
                const res = await axios.post("/api/crud", { name, description });
                setData([...data, res.data]);
            }

            // Clear form fields
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
        setData(newData); // Optimistically remove item from the UI
        try {
            await axios.delete("/api/crud", { data: { id } });
        } catch (err) {
            console.error(err);
            setData(data); // Rollback the optimistic update if request fails
        }
    };




    return (
        <div className="p-6">
            <form onSubmit={handleAddOrUpdate} className="mb-6">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="border p-2 m-2"
                    required
                    id="name"
                    name="name"
                />
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="border p-2 m-2"
                    required
                    id="description"
                    name="description"
                />
                <button type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2">
                    {isLoading ? "Saving..." : editId ? "Update" : "Add"}
                </button>

            </form>


            <ul>
                {data.map((item) => (
                    <li key={item._id} className="p-4 border rounded my-2">
                        <span>{item.name}: {item.description}</span>
                        <button
                            onClick={() => {
                                setEditId(item._id);
                                setName(item.name);
                                setDescription(item.description);
                            }}
                            className="bg-yellow-500 text-white p-1 mx-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-500 text-white p-1"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );
}
