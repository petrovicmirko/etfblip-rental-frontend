import React, { useState, useEffect } from "react";
import {
    addVehicle,
    updateVehicle,
    getAllManufacturers,
} from "../services/apiService";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    MenuItem,
    CircularProgress,
} from "@mui/material";

const AddVehiclePopup = ({ type, onClose, onVehicleAdded, initialData = null, mode = "add" }) => {
    const isEditMode = mode === "edit";

    const [vehicleType, setVehicleType] = useState(
        initialData?.type || type || "CAR"
    );

    const [formData, setFormData] = useState({
        externalId: initialData?.externalId || "",
        manufacturerId: initialData?.manufacturerId || "",
        model: initialData?.model || "",
        purchasePrice: initialData?.purchasePrice || "",
        purchaseDate: initialData?.purchaseDate || "",
        description: initialData?.description || "",
        autonomyKm: initialData?.autonomyKm || "",
        maxSpeedKmh: initialData?.maxSpeedKmh || "",
    });

    const [manufacturers, setManufacturers] = useState([]);
    const [loadingManufacturers, setLoadingManufacturers] = useState(true);

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const data = await getAllManufacturers();
                setManufacturers(data);

                if (initialData?.manufacturer?.id) {
                    setFormData((prev) => ({
                        ...prev,
                        manufacturerId: initialData.manufacturer.id.toString(),
                    }));
                }
            } catch (err) {
                console.error("Failed to load manufacturers:", err);
            } finally {
                setLoadingManufacturers(false);
            }
        };
        fetchManufacturers();
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            externalId: formData.externalId,
            type: vehicleType,
            manufacturerId: Number(formData.manufacturerId),
            model: formData.model,
            purchasePrice: Number(formData.purchasePrice),
            purchaseDate: formData.purchaseDate || null,
            autonomyKm:
                vehicleType === "BICYCLE" ? Number(formData.autonomyKm) || null : null,
            maxSpeedKmh:
                vehicleType === "SCOOTER" ? Number(formData.maxSpeedKmh) || null : null,
            description: formData.description || null,
            isBroken: initialData?.isBroken || false,
            isRented: initialData?.isRented || false,
        };

        try {
            let savedVehicle;

            if (isEditMode && initialData?.id) {
                // 🔁 UPDATE LOGIKA
                savedVehicle = await updateVehicle(initialData.id, payload);
                alert("✅ Vehicle updated successfully!");
            } else {
                // ➕ ADD LOGIKA
                savedVehicle = await addVehicle(payload);
                alert("✅ Vehicle added successfully!");
            }

            if (onVehicleAdded) {
                onVehicleAdded(savedVehicle, mode);
            }

            onClose();
        } catch (err) {
            console.error("❌ Failed to save vehicle:", err);
            alert("❌ Failed to save vehicle. Check console for details.");
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                p: 2,
            }}
            onClick={onClose}
        >
            <Paper
                sx={{
                    width: { xs: "100%", sm: 400 },
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    backdropFilter: "blur(6px)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                    textAlign="center"
                >
                    {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
                </Typography>

                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                    {/* Vehicle Type */}
                    <TextField
                        select
                        label="Type"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        fullWidth
                        disabled={isEditMode} // tip se ne mijenja prilikom editovanja
                    >
                        <MenuItem value="CAR">Car</MenuItem>
                        <MenuItem value="BICYCLE">Bicycle</MenuItem>
                        <MenuItem value="SCOOTER">Scooter</MenuItem>
                    </TextField>

                    {/* Manufacturer Dropdown */}
                    {loadingManufacturers ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <TextField
                            select
                            label="Manufacturer"
                            name="manufacturerId"
                            value={formData.manufacturerId}
                            onChange={handleChange}
                            required
                            fullWidth
                        >
                            {manufacturers.map((m) => (
                                <MenuItem key={m.id} value={m.id}>
                                    {m.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <TextField
                        label="External ID"
                        name="externalId"
                        value={formData.externalId}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Purchase Price (€)"
                        name="purchasePrice"
                        value={formData.purchasePrice}
                        onChange={handleChange}
                        required
                        type="number"
                        fullWidth
                    />

                    {vehicleType === "CAR" && (
                        <>
                            <TextField
                                label="Purchase Date"
                                type="date"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                fullWidth
                            />
                        </>
                    )}

                    {vehicleType === "BICYCLE" && (
                        <TextField
                            label="Autonomy (km)"
                            name="autonomyKm"
                            value={formData.autonomyKm}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                        />
                    )}

                    {vehicleType === "SCOOTER" && (
                        <TextField
                            label="Max Speed (km/h)"
                            name="maxSpeedKmh"
                            value={formData.maxSpeedKmh}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                        />
                    )}

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button variant="contained" type="submit">
                            {isEditMode ? "Update" : "Save"}
                        </Button>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default AddVehiclePopup;
