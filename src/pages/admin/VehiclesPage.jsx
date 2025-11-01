import React, { useEffect, useState, useCallback } from "react";
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
import { getCars, getScooters, getBicycles } from "../../services/apiService";
import AddVehiclePopup from "../../components/AddVehiclePopup";

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [activeTab, setActiveTab] = useState("CAR");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(null);

    const [pages, setPages] = useState({
        CAR: { page: 1, totalPages: 0, totalElements: 0 },
        BICYCLE: { page: 1, totalPages: 0, totalElements: 0 },
        SCOOTER: { page: 1, totalPages: 0, totalElements: 0 },
    });

    const pageSize = 5;
    const navigate = useNavigate();

    const fetchForActiveTab = useCallback(async () => {
        const { page } = pages[activeTab];
        const backendPage = Math.max(0, page - 1);

        setLoading(true);
        setError(null);

        try {
            let data;
            if (activeTab === "CAR") {
                data = await getCars(backendPage, pageSize, "id", "asc");
            } else if (activeTab === "BICYCLE") {
                data = await getBicycles(backendPage, pageSize, "id", "asc");
            } else {
                data = await getScooters(backendPage, pageSize, "id", "asc");
            }

            setVehicles(data.content || []);
            setPages((prev) => ({
                ...prev,
                [activeTab]: {
                    ...prev[activeTab],
                    totalPages: data.totalPages || 0,
                    totalElements: data.totalElements || 0,
                },
            }));
        } catch (err) {
            console.error("Failed to load vehicles:", err);
            setError("Failed to load vehicles.");
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab, pages[activeTab]?.page, pageSize]);

    useEffect(() => {
        fetchForActiveTab();
    }, [fetchForActiveTab]);

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            setVehicles((prev) => prev.filter((v) => v.id !== id));
        }
    };

    const handleRowClick = (vehicleId) => {
        navigate("./vehicleDetails", { state: { vehicleId } });
    };

    const handleTabChange = (e, newValue) => {
        setActiveTab(newValue);
        setPages((prev) => ({
            ...prev,
            [newValue]: prev[newValue] || { page: 1, totalPages: 0, totalElements: 0 },
        }));
    };

    const handlePageChange = (e, page) => {
        setPages((prev) => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], page },
        }));
    };

    const handleVehicleAdded = (newVehicle) => {
        setVehicles((prev) => {
            const updated = [newVehicle, ...prev];

            // Ako ima više od pageSize vozila, izbaci posljednje (kao da je backend na sledećoj stranici)
            if (updated.length > pageSize) {
                updated.pop();
            }


            if ((pages[activeTab].totalElements + 1) > pageSize * pages[activeTab].totalPages) {
                setPages((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], page: prev[activeTab].page + 1 }
                }));
            }

            return updated;
        });

        // Ručno ažuriranje paginacije
        setPages((prev) => {
            const old = prev[activeTab];
            const newTotalElements = old.totalElements + 1;
            const newTotalPages = Math.ceil(newTotalElements / pageSize);

            return {
                ...prev,
                [activeTab]: {
                    ...old,
                    totalElements: newTotalElements,
                    totalPages: newTotalPages,
                },
            };
        });

        setShowPopup(false);
    };

    const { totalPages: activeTotalPages } = pages[activeTab] || { totalPages: 0 };

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
                <Tabs value={activeTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                    <Tab label="Cars" value="CAR" />
                    <Tab label="Bicycles" value="BICYCLE" />
                    <Tab label="Scooters" value="SCOOTER" />
                </Tabs>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setShowPopup(activeTab)}
                    >
                        Add Vehicle
                    </Button>

                    <Button variant="outlined" color="success" component="label" startIcon={<UploadFileIcon />}>
                        Upload CSV
                        <input type="file" accept=".csv" hidden />
                    </Button>
                </Box>
            </Box>

            {/* === Table === */}
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ tableLayout: "fixed", width: "100%", "& th, & td": { textAlign: "center" } }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "40%" }}>Model</TableCell>
                            {/* ✅ Promijenjeni nazivi kolona */}
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "15%" }}>Operational</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "15%" }}>Free</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "20%" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {vehicles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No vehicles found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            vehicles.map((vehicle) => (
                                <TableRow
                                    key={vehicle.id}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => handleRowClick(vehicle.id)}
                                >
                                    <TableCell>{vehicle.model}</TableCell>

                                    {/* ✅ Promijenjena logika — prikazuje "✅" ako je operational (nije broken) */}
                                    <TableCell>
                                        {vehicle.isBroken ? (
                                            <span style={{ color: "red" }}>❌</span>
                                        ) : (
                                            <span style={{ color: "green" }}>✅</span>
                                        )}
                                    </TableCell>

                                    {/* ✅ Free ako nije rented */}
                                    <TableCell>
                                        {vehicle.isRented ? (
                                            <span style={{ color: "orange" }}>❌</span>
                                        ) : (
                                            <span style={{ color: "green" }}>✅</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
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

            {activeTotalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination
                        count={activeTotalPages}
                        page={pages[activeTab]?.page || 1}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            {/* ✅ sada poziva lokalnu funkciju umjesto API refresha */}
            {showPopup && (
                <AddVehiclePopup
                    type={showPopup} onClose={() => setShowPopup(null)} onVehicleAdded={handleVehicleAdded} />
            )}
        </Container>
    );
};

export default VehiclesPage;
