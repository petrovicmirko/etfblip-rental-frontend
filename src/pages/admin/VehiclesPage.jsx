// VehiclesPage.jsx
import React from "react";
import "./VehiclesPage.css";

const vehiclesData = [
    {
        id: 1,
        externalId: "VEH123",
        type: "Car",
        manufacturer: {
            id: 1,
            name: "Toyota",
            country: "Japan",
            address: "123 Tokyo St",
            phone: "123456",
            fax: "654321",
            email: "info@toyota.com"
        },
        model: "Corolla",
        purchasePrice: 20000.0,
        purchaseDate: "2025-01-10",
        description: "Reliable sedan",
        imagePath: "/images/corolla.jpg",
        isBroken: false,
        isRented: false
    },
    {
        id: 1,
        externalId: "VEH123",
        type: "Car",
        manufacturer: {
            id: 1,
            name: "Toyota",
            country: "Japan",
            address: "123 Tokyo St",
            phone: "123456",
            fax: "654321",
            email: "info@toyota.com"
        },
        model: "Corolla",
        purchasePrice: 20000.0,
        purchaseDate: "2025-01-10",
        description: "Reliable sedan",
        imagePath: "/images/corolla.jpg",
        isBroken: false,
        isRented: false
    },
    {
        id: 1,
        externalId: "VEH123",
        type: "Car",
        manufacturer: {
            id: 1,
            name: "Toyota",
            country: "Japan",
            address: "123 Tokyo St",
            phone: "123456",
            fax: "654321",
            email: "info@toyota.com"
        },
        model: "Corolla",
        purchasePrice: 20000.0,
        purchaseDate: "2025-01-10",
        description: "Reliable sedan",
        imagePath: "/images/corolla.jpg",
        isBroken: false,
        isRented: false
    }, {
        id: 1,
        externalId: "VEH123",
        type: "Car",
        manufacturer: {
            id: 1,
            name: "Toyota",
            country: "Japan",
            address: "123 Tokyo St",
            phone: "123456",
            fax: "654321",
            email: "info@toyota.com"
        },
        model: "Corolla",
        purchasePrice: 20000.0,
        purchaseDate: "2025-01-10",
        description: "Reliable sedan",
        imagePath: "/images/corolla.jpg",
        isBroken: false,
        isRented: false
    }, {
        id: 1,
        externalId: "VEH123",
        type: "Car",
        manufacturer: {
            id: 1,
            name: "Toyota",
            country: "Japan",
            address: "123 Tokyo St",
            phone: "123456",
            fax: "654321",
            email: "info@toyota.com"
        },
        model: "Corolla",
        purchasePrice: 20000.0,
        purchaseDate: "2025-01-10",
        description: "Reliable sedan",
        imagePath: "/images/corolla.jpg",
        isBroken: false,
        isRented: false
    },
    // Dodaj ovdje više vozila po potrebi
];

const VehiclesPage = () => {
    return (
        <div className="vehicles-container">
            <table className="vehicles-table">
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
                    {vehiclesData.map((vehicle) => (
                        <tr key={vehicle.id}>
                            <td>{vehicle.externalId}</td>
                            <td>{vehicle.type}</td>
                            <td>{vehicle.manufacturer.name}</td>
                            <td>{vehicle.model}</td>
                            <td>${vehicle.purchasePrice.toFixed(2)}</td>
                            <td>{vehicle.purchaseDate}</td>
                            <td>{vehicle.description}</td>
                            <td>{vehicle.isBroken ? "Yes" : "No"}</td>
                            <td>{vehicle.isRented ? "Yes" : "No"}</td>
                            <td>
                                <img
                                    src={vehicle.imagePath}
                                    alt={vehicle.model}
                                    className="vehicle-image"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VehiclesPage;
