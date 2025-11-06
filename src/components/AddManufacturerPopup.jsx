import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { createManufacturer, updateManufacturer } from "../services/apiService";

const AddManufacturerPopup = ({ onClose, onManufacturerAdded, initialData = null, mode = "add" }) => {
    const isEditMode = mode === "edit";

    const [form, setForm] = useState({
        name: initialData?.name || "",
        country: initialData?.country || "",
        address: initialData?.address || "",
        phone: initialData?.phone || "",
        fax: initialData?.fax || "",
        email: initialData?.email || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert("Name cannot be empty!");
            return;
        }

        try {
            let saved;
            if (isEditMode && initialData?.id) {
                saved = await updateManufacturer(initialData.id, form);
                alert("✅ Manufacturer updated successfully!");
            } else {
                saved = await createManufacturer(form);
                alert("✅ Manufacturer added successfully!");
            }

            if (onManufacturerAdded) onManufacturerAdded(saved, mode);
            onClose();
        } catch (err) {
            console.error("❌ Failed to save manufacturer:", err);
            alert("❌ Failed to save manufacturer.");
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
                    width: { xs: "100%", sm: 450 },
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                    {isEditMode ? "Edit Manufacturer" : "Add Manufacturer"}
                </Typography>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
                    <TextField label="Country" name="country" value={form.country} onChange={handleChange} fullWidth />
                    <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth />
                    <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
                    <TextField label="Fax" name="fax" value={form.fax} onChange={handleChange} fullWidth />
                    <TextField label="Email" name="email" value={form.email} onChange={handleChange} type="email" fullWidth />

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

export default AddManufacturerPopup;
