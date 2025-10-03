import React, { useEffect, useState } from "react";
import { getVehicles } from "../../services/apiService";
import "../../styles/global.css";

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const data = await getVehicles();
                console.log("Vehicles data:", data);
                setVehicles(data);
            } catch (err) {

                console.error("Failed to load vehicles:", err.response || err.message);
                console.error("Failed to load vehicles:", err);

                if (err.response) {
                    console.error("Response data:", err.response.data);
                    console.error("Response status:", err.response.status);
                    console.error("Response headers:", err.response.headers);
                } else {
                    console.error("Error message:", err.message);
                }
                setError("Failed to load vehicles.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="container">
            <div style={{ width: "100%" }}>
                <h1 style={{ textAlign: "center", marginBottom: "10px" }}>Vehicles</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>External ID</th>
                            <th>Type</th>
                            <th>Manufacturer</th>
                            <th>Model</th>
                            <th>Purchase Price</th>
                            <th>Purchase Date</th>
                            <th>Description</th>
                            <th>Broken</th>
                            <th>Rented</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.externalId}</td>
                                <td>{vehicle.type}</td>
                                <td>{vehicle.manufacturer?.name}</td>
                                <td>{vehicle.model}</td>
                                <td>${vehicle.purchasePrice?.toFixed(2)}</td>
                                <td>{vehicle.purchaseDate}</td>
                                <td>{vehicle.description}</td>
                                <td>{vehicle.isBroken ? "Yes" : "No"}</td>
                                <td>{vehicle.isRented ? "Yes" : "No"}</td>
                                <td>
                                    {vehicle.imagePath ? (
                                        <img
                                            src={vehicle.imagePath}
                                            alt={vehicle.model}
                                            className="image"
                                        />
                                    ) : (
                                        "No image"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VehiclesPage;
