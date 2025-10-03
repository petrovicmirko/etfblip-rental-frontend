import React, { useEffect, useState } from "react";
import { getManufacturers, createManufacturer, updateManufacturer, deleteManufacturer } from "../../services/apiService";
import "../../styles/global.css";

const ManufacturersPage = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newName, setNewName] = useState("");
    const [editModal, setEditModal] = useState({ isOpen: false, id: null, name: "" });

    const fetchManufacturers = async () => {
        try {
            const data = await getManufacturers();
            setManufacturers(data);
        } catch (err) {
            console.error("Failed to load manufacturers:", err);
            setError("Failed to load manufacturers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManufacturers();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        try {
            await createManufacturer({ name: newName });
            setNewName("");
            fetchManufacturers();
        } catch (err) {
            console.error("Failed to create manufacturer:", err);
        }
    };

    const handleUpdate = async (id, name) => {
        if (!name.trim()) return;
        try {
            await updateManufacturer(id, { name });
            closeModal();
            fetchManufacturers();
        } catch (err) {
            console.error("Failed to update manufacturer:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this manufacturer?")) return;
        try {
            await deleteManufacturer(id);
            fetchManufacturers();
        } catch (err) {
            console.error("Failed to delete manufacturer:", err);
        }
    };

    const openModal = (m) => {
        setEditModal({ isOpen: true, id: m.id, name: m.name });
    };

    const closeModal = () => {
        setEditModal({ isOpen: false, id: null, name: "" });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="manufacturers-container">
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Manufacturers</h1>

            <div className="form-inline">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter manufacturer name"
                />
                <button className="primary-btn" onClick={handleAdd}>Add</button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading && manufacturers.length === 0 && (
                        <tr>
                            <td colSpan="3">No manufacturers found</td>
                        </tr>
                    )}
                    {manufacturers.map((m) => (
                        <tr key={m.id}>
                            <td>{m.id}</td>
                            <td>{m.name}</td>
                            <td>
                                <button className="primary-btn" onClick={() => openModal(m)}>Edit</button>
                                <button className="danger-btn" onClick={() => handleDelete(m.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {editModal.isOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>Edit Manufacturer</h2>
                        <input
                            type="text"
                            value={editModal.name}
                            onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                        />
                        <div style={{ marginTop: "10px" }}>
                            <button className="primary-btn" onClick={() => handleUpdate(editModal.id, editModal.name)}>Save</button>
                            <button className="secondary-btn" onClick={closeModal} style={{ marginLeft: "10px" }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManufacturersPage;
