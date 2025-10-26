import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
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
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { getVehicles } from "../../services/apiService";
import AddVehiclePopup from "../../components/AddVehiclePopup";

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [activeTab, setActiveTab] = useState("CAR");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const pageSize = 5; // broj vozila po stranici
    const navigate = useNavigate();

    // 🚀 Učitavanje podataka sa backend paginacijom
    const fetchVehicles = async () => {
        setLoading(true);
        setError(null);
        try {
            // Backend koristi page = 0-based, zato (currentPage - 1)
            const data = await getVehicles(currentPage - 1, pageSize, "id", "asc");
            setVehicles(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err) {
            console.error("Failed to load vehicles:", err);
            setError("Failed to load vehicles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [currentPage]); // kad se stranica promijeni, pozovi ponovo backend

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            setVehicles(vehicles.filter((v) => v.id !== id));
        }
    };

    const handleRowClick = (vehicleId) => {
        navigate("./vehicleDetails", { state: { vehicleId } });
    };

    // 🚘 Filtriranje po tipu vozila (CAR, SCOOTER, BICYCLE)
    const filteredVehicles = vehicles.filter((v) => v.type === activeTab);

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
                Vehicle Management
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mb: 3,
                    gap: 2,
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => {
                        setActiveTab(newValue);
                        setCurrentPage(1); // reset paginacije
                    }}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Cars" value="CAR" />
                    <Tab label="Bicycles" value="BICYCLE" />
                    <Tab label="Scooters" value="SCOOTER" />
                </Tabs>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setShowPopup(true)}
                    >
                        Add Vehicle
                    </Button>

                    <Button
                        variant="outlined"
                        color="success"
                        component="label"
                        startIcon={<UploadFileIcon />}
                    >
                        Upload CSV
                        <input type="file" accept=".csv" hidden />
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table
                    sx={{
                        tableLayout: "fixed",
                        width: "100%",
                        "& th, & td": { textAlign: "center" },
                    }}
                >
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "40%" }}>
                                Model
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "15%" }}>
                                Broken
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "15%" }}>
                                Rented
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "20%" }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredVehicles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No vehicles found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredVehicles.map((vehicle) => (
                                <TableRow
                                    key={vehicle.id}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => handleRowClick(vehicle.id)}
                                >
                                    <TableCell>{vehicle.model}</TableCell>
                                    <TableCell align="center">
                                        {vehicle.isBroken ? (
                                            <span style={{ color: "red" }}>❌</span>
                                        ) : (
                                            <span style={{ color: "green" }}>✅</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {vehicle.isRented ? (
                                            <span style={{ color: "orange" }}>✅</span>
                                        ) : (
                                            <span style={{ color: "green" }}>❌</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={(e) => handleDelete(vehicle.id, e)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* === Pagination Kontrola === */}
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(e, page) => setCurrentPage(page)}
                        color="primary"
                    />
                </Box>
            )}

            {showPopup && (
                <AddVehiclePopup
                    onClose={() => setShowPopup(false)}
                    onVehicleAdded={fetchVehicles}
                />
            )}
        </Container>
    );
};

export default VehiclesPage;
