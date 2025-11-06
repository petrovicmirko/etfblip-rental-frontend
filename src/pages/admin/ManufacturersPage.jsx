import React, { useEffect, useState, useCallback } from "react";
import {
    Container,
    Box,
    Typography,
    IconButton,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    getManufacturers,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer,
} from "../../services/apiService";
import AddManufacturerPopup from "../../components/AddManufacturerPopup";

const ManufacturersPage = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    const fetchManufacturers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getManufacturers(page - 1, pageSize, "id", "asc");
            setManufacturers(data.content || data || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error("❌ Failed to load manufacturers:", err);
            setError("Failed to load manufacturers.");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchManufacturers();
    }, [fetchManufacturers]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this manufacturer?")) return;
        try {
            await deleteManufacturer(id);
            setManufacturers((prev) => prev.filter((m) => m.id !== id));
        } catch (error) {
            console.error("❌ Error deleting manufacturer:", error);
            alert("Failed to delete manufacturer. Try again.");
        }
    };

    const handleManufacturerAdded = (manufacturer, mode = "add") => {
        setManufacturers((prev) => {
            if (mode === "edit") {
                return prev.map((m) => (m.id === manufacturer.id ? manufacturer : m));
            } else {
                const updated = [manufacturer, ...prev];
                if (updated.length > pageSize) updated.pop();

                setTotalPages((prevPages) => Math.ceil((prevPages * pageSize + 1) / pageSize));

                return updated;
            }
        });
        setShowPopup(null);
    };

    const handlePageChange = (e, newPage) => {
        setPage(newPage);
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
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Manufacturer Management
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 3,
                    gap: 2,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setShowPopup({ mode: "add" })}
                >
                    Add Manufacturer
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table sx={{
                    tableLayout: "fixed",
                    width: "100%",
                    "& th, & td": {
                        textAlign: "center",
                        maxWidth: 150,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }
                }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Country</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Address</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fax</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {manufacturers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No manufacturers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            manufacturers.map((m) => (
                                <TableRow key={m.id} hover>
                                    <TableCell>{m.name}</TableCell>
                                    <TableCell>{m.country}</TableCell>
                                    <TableCell >{m.address}</TableCell>
                                    <TableCell>{m.phone}</TableCell>
                                    <TableCell>{m.fax}</TableCell>
                                    <TableCell>{m.email}</TableCell>
                                    <TableCell sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => setShowPopup({ mode: "edit", manufacturer: m })}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={(e) => handleDelete(m.id, e)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                </Box>
            )}

            {showPopup && (
                <AddManufacturerPopup
                    onClose={() => setShowPopup(null)}
                    onManufacturerAdded={handleManufacturerAdded}
                    initialData={showPopup.manufacturer || null}
                    mode={showPopup.mode || "add"}
                />
            )}
        </Container>
    );
};

export default ManufacturersPage;
