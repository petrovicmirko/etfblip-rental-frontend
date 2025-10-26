import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    getManufacturers,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer,
} from "../../services/apiService";

const ManufacturersPage = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState("");
    const [editModal, setEditModal] = useState({ open: false, id: null, name: "" });

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

    const handleUpdate = async () => {
        if (!editModal.name.trim()) return;
        try {
            await updateManufacturer(editModal.id, { name: editModal.name });
            handleCloseModal();
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

    const handleOpenModal = (m) => {
        setEditModal({ open: true, id: m.id, name: m.name });
    };

    const handleCloseModal = () => {
        setEditModal({ open: false, id: null, name: "" });
    };

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
            </Box>
        );

    if (error)
        return (
            <Alert severity="error" sx={{ mt: 4, mx: "auto", width: "fit-content" }}>
                {error}
            </Alert>
        );

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Manufacturers Management
            </Typography>

            {/* === Forma za dodavanje === */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                }}
            >
                <TextField
                    label="Manufacturer name"
                    variant="outlined"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    sx={{ flex: 1, minWidth: "250px" }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    sx={{ height: "56px" }}
                >
                    Add
                </Button>
            </Box>

            {/* === Tabela === */}
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {manufacturers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    No manufacturers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            manufacturers.map((m) => (
                                <TableRow key={m.id} hover>
                                    {/* Uklonjena kolona za ID */}
                                    <TableCell>{m.name}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                startIcon={<EditIcon />}
                                                onClick={() => handleOpenModal(m)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDelete(m.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>

                </Table>
            </TableContainer>

            {/* === Modal za edit === */}
            <Dialog open={editModal.open} onClose={handleCloseModal}>
                <DialogTitle>Edit Manufacturer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Manufacturer name"
                        fullWidth
                        variant="outlined"
                        value={editModal.name}
                        onChange={(e) =>
                            setEditModal({ ...editModal, name: e.target.value })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManufacturersPage;
