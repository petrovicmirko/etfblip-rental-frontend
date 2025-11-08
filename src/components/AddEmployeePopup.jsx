import React, { useState } from "react";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    MenuItem, InputAdornment, IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { addEmployee, updateEmployee } from "../services/apiService";

const AddEmployeePopup = ({ onClose, onEmployeeSaved, initialData = null, mode = "add" }) => {
    const isEditMode = mode === "edit";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: initialData?.username || "",
        email: initialData?.email || "",
        password: "",
        confirmPassword: "",
        role: initialData?.role || "ADMIN",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Provera da li se lozinke poklapaju (samo u add režimu)
        if (!isEditMode && formData.password !== formData.confirmPassword) {
            alert("❌ Password and Confirm Password do not match!");
            return;
        }

        try {
            let savedEmployee;

            if (isEditMode && initialData?.id) {
                savedEmployee = await updateEmployee(initialData.id, {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                });
                alert("✅ Employee updated successfully!");
            } else {
                savedEmployee = await addEmployee(formData);
                alert("✅ Employee added successfully!");
            }

            if (onEmployeeSaved) onEmployeeSaved(savedEmployee);
            onClose();
        } catch (err) {
            console.error("❌ Failed to save employee:", err);
            alert("❌ Failed to save employee. Check console for details.");
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
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                    {isEditMode ? "Edit Employee" : "Add New Employee"}
                </Typography>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        type="email"
                        fullWidth
                    />

                    {!isEditMode && (
                        <>
                            <TextField
                                label="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                type={showPassword ? "text" : "password"} // toggle tip
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </>
                    )}

                    <TextField
                        select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="OPERATOR">OPERATOR</MenuItem>
                        <MenuItem value="MANAGER">MANAGER</MenuItem>
                    </TextField>

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

export default AddEmployeePopup;
