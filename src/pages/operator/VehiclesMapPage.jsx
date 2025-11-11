import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const VehiclesMapPage = () => {
    // Lokacija – npr. Banja Luka
    const center = [44.7722, 17.1910];

    // Primjer podataka o vozilima (možeš kasnije povući iz API-ja)
    const vehicles = [
        { id: 1, name: "Audi A3", position: [44.775, 17.190] },
        { id: 2, name: "BMW X5", position: [44.770, 17.185] },
        { id: 3, name: "Golf 7", position: [44.773, 17.195] },
    ];

    return (
        <div style={{ height: "600px", width: "100%" }}>
            <MapContainer center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "600px", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
                    url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zkFE7Sfq7wyBpItaRYUD`}
                />


                {vehicles.map((v) => (
                    <Marker key={v.id} position={v.position}>
                        <Popup>
                            <strong>{v.name}</strong>
                            <br />
                            Status: Active
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default VehiclesMapPage;
