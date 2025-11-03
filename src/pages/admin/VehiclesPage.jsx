import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { addVehicle, deleteVehicle } from "../../services/apiService";
import Papa from "papaparse";

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

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

        try {
            await deleteVehicle(id); // 👈 poziv prema backendu
            setVehicles((prev) => prev.filter((v) => v.id !== id));

            // ✅ ažuriraj paginaciju
            setPages((prev) => {
                const old = prev[activeTab];
                const newTotalElements = Math.max(0, old.totalElements - 1);
                const newTotalPages = Math.ceil(newTotalElements / pageSize);
                return {
                    ...prev,
                    [activeTab]: { ...old, totalElements: newTotalElements, totalPages: newTotalPages },
                };
            });
        } catch (error) {
            console.error("❌ Error deleting vehicle:", error);
            alert("Failed to delete vehicle. Try again.");
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

    const handleVehicleAdded = (vehicle, mode = "add") => {
        setVehicles((prev) => {
            if (mode === "edit") {
                // 🔁 Zamijeni postojeće vozilo
                return prev.map((v) => (v.id === vehicle.id ? vehicle : v));
            } else {
                // ➕ Dodaj novo vozilo
                const updated = [vehicle, ...prev];
                if (updated.length > pageSize) updated.pop();
                return updated;
            }
        });

        // Ručno ažuriranje paginacije samo kod dodavanja
        if (mode === "add") {
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
        }

        setShowPopup(false);
    };

    const handleCsvUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log("📂 Odabrani fajl:", file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                console.log("✅ Rezultati CSV parsiranja:", results);
                if (!Array.isArray(results.data) || results.data.length === 0) {
                    alert("⚠️ CSV fajl je prazan ili neispravan!");
                    return;
                }

                // Parsiranje CSV-a u niz vozila
                const parsedVehicles = results.data.map((row) => ({
                    externalId: row.external_id || "",
                    type: row.type?.toUpperCase() || activeTab,
                    manufacturerId: Number(row.manufacturer_id) || 0,
                    model: row.model || "N/A",
                    purchasePrice: Number(row.purchase_price) || 0,
                    purchaseDate: row.purchase_date || null,
                    description: row.description || "",
                    autonomyKm: row.autonomy_km ? Number(row.autonomy_km) : null,
                    maxSpeedKmh: row.max_speed_kmh ? Number(row.max_speed_kmh) : null,
                    isBroken:
                        row.is_broken?.toString().trim().toUpperCase() === "TRUE" ||
                        row.is_broken?.toString().trim() === "1",
                    isRented:
                        row.is_rented?.toString().trim().toUpperCase() === "TRUE" ||
                        row.is_rented?.toString().trim() === "1",
                }));

                console.log(`🔍 Ukupno učitano ${parsedVehicles.length} vozila iz CSV-a.`);

                let successful = 0;

                // ⏳ Pokušaj upisa svakog vozila u bazu
                for (const [index, vehicle] of parsedVehicles.entries()) {
                    try {
                        const savedVehicle = await addVehicle(vehicle);
                        console.log(`💾 Uspješno dodano vozilo [${index + 1}]:`, savedVehicle);
                        successful++;

                        // Ažuriraj state odmah (dodaj novo vozilo u tabelu)
                        if (savedVehicle.type === activeTab) {
                            setVehicles((prev) => {
                                const updated = [savedVehicle, ...prev];
                                if (updated.length > pageSize) {
                                    updated.pop(); // zadrži prikaz do pageSize
                                }
                                return updated;
                            });

                            // ✅ Ažuriraj paginaciju samo za aktivni tab
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
                        }

                    } catch (err) {
                        console.warn(`⚠️ Neuspješan upis vozila [${index + 1}]:`, err.message);
                        // Nastavi dalje – preskače to vozilo
                    }
                }

                alert(`✅ Uspješno upisano ${successful} od ${parsedVehicles.length} vozila!`);

                // 🔁 Nakon što su sva vozila obrađena, osvježi prikaz
                await fetchForActiveTab();

                e.target.value = null; // reset input
            },
            error: (err) => {
                console.error("❌ CSV parsing error:", err);
                alert("❌ Failed to parse CSV file.");
            },
        });
    };

    // const handleCsvUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     console.log("📂 Odabrani fajl:", file.name);

    //     Papa.parse(file, {
    //         header: true,
    //         skipEmptyLines: true,
    //         complete: (results) => {
    //             console.log("✅ Rezultati CSV parsiranja:", results);
    //             console.log("📄 Sirovi podaci:", results.data);

    //             if (!Array.isArray(results.data) || results.data.length === 0) {
    //                 console.warn("⚠️ CSV fajl je prazan ili nije ispravno formatiran.");
    //                 alert("CSV fajl je prazan ili neispravan!");
    //                 return;
    //             }

    //             const parsedVehicles = results.data.map((row, index) => {
    //                 const vehicle = {
    //                     id: Date.now() + Math.random(), // privremeni ID dok nema backend
    //                     externalId: row.external_id || "",
    //                     type: row.type?.toUpperCase() || activeTab,
    //                     manufacturerId: Number(row.manufacturer_id) || 0,
    //                     model: row.model || "N/A",
    //                     purchasePrice: Number(row.purchase_price) || 0,
    //                     purchaseDate: row.purchase_date || null,
    //                     description: row.description || "",
    //                     autonomyKm: row.autonomy_km ? Number(row.autonomy_km) : null,
    //                     maxSpeedKmh: row.max_speed_kmh ? Number(row.max_speed_kmh) : null,
    //                     isBroken:
    //                         row.is_broken?.toString().trim().toUpperCase() === "TRUE" ||
    //                         row.is_broken?.toString().trim() === "1",
    //                     isRented:
    //                         row.is_rented?.toString().trim().toUpperCase() === "TRUE" ||
    //                         row.is_rented?.toString().trim() === "1",
    //                 };

    //                 console.log(`🚗 Vozilo [${index + 1}]:`, vehicle);
    //                 return vehicle;
    //             });

    //             console.log(`✅ Ukupno učitano vozila: ${parsedVehicles.length}`);

    //             // Dodaj u postojeći state, simulirajući učitavanje sa API-ja
    //             setVehicles((prev) => {
    //                 const updated = [...parsedVehicles, ...prev];
    //                 console.log("📊 Novi vehicles state:", updated);
    //                 return updated;
    //             });

    //             // Ažuriraj paginaciju
    //             setPages((prev) => {
    //                 const old = prev[activeTab];
    //                 const newTotalElements = old.totalElements + parsedVehicles.length;
    //                 const newTotalPages = Math.ceil(newTotalElements / pageSize);

    //                 const updatedPages = {
    //                     ...prev,
    //                     [activeTab]: {
    //                         ...old,
    //                         totalElements: newTotalElements,
    //                         totalPages: newTotalPages,
    //                     },
    //                 };

    //                 console.log("📄 Novi pagination state:", updatedPages);
    //                 return updatedPages;
    //             });

    //             alert(`✅ Uspješno učitano ${parsedVehicles.length} vozila iz CSV fajla!`);
    //             e.target.value = null; // resetuj input
    //         },
    //         error: (err) => {
    //             console.error("❌ CSV parsing error:", err);
    //             alert("❌ Failed to parse CSV file.");
    //         },
    //     });
    // };

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
                        <input type="file" accept=".csv" hidden onChange={handleCsvUpload} />
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

                                    <TableCell sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowPopup({ type: activeTab, mode: "edit", vehicle });
                                            }}
                                        >
                                            Edit
                                        </Button>

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

            {showPopup && (
                <AddVehiclePopup
                    type={showPopup.type || showPopup} // podržava i staru i novu logiku
                    onClose={() => setShowPopup(null)}
                    onVehicleAdded={handleVehicleAdded}
                    initialData={showPopup.vehicle || null} // 👈 prosleđuje podatke ako je "edit" mod
                    mode={showPopup.mode || "add"} // 👈 novi prop
                />
            )}
        </Container>
    );
};

export default VehiclesPage;
