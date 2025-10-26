import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getVehicleById } from "../../services/apiService";
import "../../styles/global.css";

const VehicleDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const vehicleId = location.state?.vehicleId || sessionStorage.getItem("vehicleId");

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!vehicleId) {
            navigate("/admin/vehicles");
            return;
        }

        sessionStorage.setItem("vehicleId", vehicleId);

        const fetchVehicle = async () => {
            try {
                const data = await getVehicleById(vehicleId);
                setVehicle(data);
            } catch (err) {
                console.error("Failed to load vehicle:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();

        return () => sessionStorage.removeItem("vehicleId");
    }, [vehicleId, navigate]);

    if (loading) return <p>Loading...</p>;
    if (!vehicle) return <p>Vehicle not found.</p>;

    // --- Dinamički sadržaj ---
    const renderVehicleDetails = () => {
        switch (vehicle.type) {
            case "CAR":
                return (
                    <>
                        <p><strong>Unique ID:</strong> {vehicle.externalId}</p>
                        <p><strong>Manufacturer:</strong> {vehicle.manufacturer?.name}</p>
                        <p><strong>Model:</strong> {vehicle.model}</p>
                        <p><strong>Purchase Date:</strong> {vehicle.purchaseDate}</p>
                        <p><strong>Purchase Price:</strong> {vehicle.purchasePrice} €</p>
                        <p><strong>Description:</strong> {vehicle.description}</p>
                    </>
                );
            case "BICYCLE":
                return (
                    <>
                        <p><strong>Unique ID:</strong> {vehicle.externalId}</p>
                        <p><strong>Manufacturer:</strong> {vehicle.manufacturer?.name}</p>
                        <p><strong>Model:</strong> {vehicle.model}</p>
                        <p><strong>Purchase Price:</strong> {vehicle.purchasePrice} €</p>
                        <p><strong>Autonomy:</strong> {vehicle.autonomyKm} km</p>
                    </>
                );
            case "SCOOTER":
                return (
                    <>
                        <p><strong>Unique ID:</strong> {vehicle.externalId}</p>
                        <p><strong>Manufacturer:</strong> {vehicle.manufacturer?.name}</p>
                        <p><strong>Model:</strong> {vehicle.model}</p>
                        <p><strong>Purchase Price:</strong> {vehicle.purchasePrice} €</p>
                        <p><strong>Max Speed:</strong> {vehicle.maxSpeedKmh} km/h</p>
                    </>
                );
            default:
                return <p>Unknown vehicle type.</p>;
        }
    };

    return (
        <div className="column">
            <h1>Vehicle Details</h1>

            {/* Slika vozila */}
            {vehicle.imageUrl && (
                <img
                    src={vehicle.imageUrl}
                    alt={vehicle.model}
                    style={{ width: "300px", borderRadius: "8px", marginBottom: "15px" }}
                />
            )}

            {renderVehicleDetails()}

            {/* Status */}
            <p><strong>Broken:</strong> {vehicle.isBroken ? "Yes" : "No"}</p>
            <p><strong>Rented:</strong> {vehicle.isRented ? "Yes" : "No"}</p>

            {/* Ako je pokvareno */}
            {/* {vehicle.isBroken && (
                <>
                    <p><strong>Failure Reason:</strong> {vehicle.failureDescription}</p>
                    <p><strong>Failure Date:</strong> {vehicle.failureDate}</p>
                </>
            )} */}

            <button className="back-btn" onClick={() => navigate(-1)}>
                ⬅ Back
            </button>
        </div>
    );
};

export default VehicleDetailsPage;
