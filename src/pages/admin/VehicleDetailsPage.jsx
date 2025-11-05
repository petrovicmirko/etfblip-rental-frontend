import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button,
    Grid,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
    getVehicleById,
    getVehicleMalfunctions,
    getVehicleRentals,
    addVehicleMalfunction,
    deleteVehicleMalfunction,
    fixVehicle,
} from "../../services/apiService";

const VehicleDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const vehicleId = location.state?.vehicleId || sessionStorage.getItem("vehicleId");

    const [vehicle, setVehicle] = useState(null);
    const [malfunctions, setMalfunctions] = useState([]);
    const [rentals, setRentals] = useState([]); // 👈 novo
    const [loading, setLoading] = useState(true);
    const [showAddMalfunction, setShowAddMalfunction] = useState(false);
    const [newMalfunction, setNewMalfunction] = useState({ description: "" });

    const fetchData = async () => {
        try {
            const [vData, fData, rData] = await Promise.all([
                getVehicleById(vehicleId),
                getVehicleMalfunctions(vehicleId),
                getVehicleRentals(vehicleId), // 👈 dohvatimo iznajmljivanja
            ]);
            setVehicle(vData);
            setMalfunctions(fData || []);
            setRentals(rData || []);
        } catch (err) {
            console.error("Failed to load vehicle:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!vehicleId) {
            navigate("/admin/vehicles");
            return;
        }

        sessionStorage.setItem("vehicleId", vehicleId);
        fetchData();

        return () => sessionStorage.removeItem("vehicleId");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleId]);

    const handleAddMalfunction = async () => {
        if (!newMalfunction.description.trim()) return;
        try {
            const added = await addVehicleMalfunction(vehicleId, newMalfunction);
            setMalfunctions((prev) => [...prev, added]);
            setNewMalfunction({ description: "" });
            setShowAddMalfunction(false);

            setVehicle((prev) => ({ ...prev, isBroken: true }));
        } catch (err) {
            console.error("Failed to add malfunction:", err);
            alert("❌ Failed to add Malfunction.");
        }
    };

    const handleDeleteMalfunction = async (id) => {
        if (!window.confirm("Are you sure you want to delete this malfunction?")) return;
        try {
            await deleteVehicleMalfunction(id);
            setMalfunctions((prev) => prev.filter((f) => f.id !== id));
        } catch (err) {
            console.error("Failed to delete malfunction:", err);
        }
    };

    const handleFix = async () => {
        if (!window.confirm("Confirm vehicle fix?")) return;
        try {
            await fixVehicle(vehicleId);
            alert("✅ Vehicle fixed successfully!");
            await fetchData(); // 👈 odmah osvježi sve podatke
        } catch (err) {
            console.error("Malfunction failed:", err);
            alert("❌ Failed to malfunction vehicle.");
        }
    };

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
            </Box>
        );

    if (!vehicle)
        return (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                Vehicle not found.
            </Typography>
        );

    const renderVehicleDetails = () => {
        const commonFields = (
            <>
                <Detail label="Unique ID" value={vehicle.externalId} />
                <Detail label="Manufacturer" value={vehicle.manufacturer?.name} />
                <Detail label="Model" value={vehicle.model} />
                <Detail label="Purchase Price" value={`${vehicle.purchasePrice} €`} />
            </>
        );

        switch (vehicle.type) {
            case "CAR":
                return (
                    <>
                        {commonFields}
                        <Detail label="Purchase Date" value={vehicle.purchaseDate} />
                        <Detail label="Description" value={vehicle.description} />
                    </>
                );
            case "BICYCLE":
                return (
                    <>
                        {commonFields}
                        <Detail label="Autonomy" value={`${vehicle.autonomyKm} km`} />
                    </>
                );
            case "SCOOTER":
                return (
                    <>
                        {commonFields}
                        <Detail label="Max Speed" value={`${vehicle.maxSpeedKmh} km/h`} />
                    </>
                );
            default:
                return <Typography>Unknown vehicle type.</Typography>;
        }
    };

    return (
        <Box sx={{ maxWidth: "1000px", mx: "auto", mt: 5, px: 2 }}>
            <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        Vehicle Details
                    </Typography>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </Box>

                {vehicle.imageUrl && (
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <img
                            src={vehicle.imageUrl}
                            alt={vehicle.model}
                            style={{
                                maxWidth: "100%",
                                borderRadius: "12px",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                )}

                <Grid container spacing={2}>
                    {renderVehicleDetails()}
                    <Detail label="Broken" value={vehicle.isBroken ? "Yes ❌" : "No ✅"} />
                    <Detail label="Rented" value={vehicle.isRented ? "Yes 🔒" : "No ✅"} />
                </Grid>

                {/* 🔧 Malfunctions Section */}
                <Divider sx={{ my: 4 }} />
                <Section
                    title="Malfunctions"
                    actions={
                        <>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setShowAddMalfunction(true)}
                            >
                                Add Malfunction
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                disabled={!vehicle.isBroken}
                                onClick={handleFix}
                            >
                                Fix Vehicle
                            </Button>
                        </>
                    }
                >
                    {malfunctions.length === 0 ? (
                        <Typography color="text.secondary">
                            No malfunctions recorded.
                        </Typography>
                    ) : (
                        <List>
                            {malfunctions.map((f) => (
                                <ListItem key={f.id} divider>
                                    <ListItemText
                                        primary={f.description}
                                        secondary={`Reported: ${f.date || "N/A"}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            color="error"
                                            onClick={() => handleDeleteMalfunction(f.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Section>

                {/* 🚗 Rentals Section */}
                {/* 🚗 Rentals Section */}
                <Divider sx={{ my: 4 }} />
                <Section title="Rentals">
                    {rentals.length === 0 ? (
                        <Typography color="text.secondary">
                            No rentals recorded.
                        </Typography>
                    ) : (
                        <List>
                            {rentals.map((r) => {
                                const start = new Date(r.rentStart);
                                const end = new Date(r.rentEnd);
                                const durationHours = ((end - start) / (1000 * 60 * 60)).toFixed(1); // trajanje u satima

                                return (
                                    <ListItem key={r.id} divider>
                                        <ListItemText
                                            primary={`${r.user.firstName} ${r.user.lastName}`}
                                            secondary={
                                                <>
                                                    <div>From: {start.toLocaleString()}</div>
                                                    <div>To: {end.toLocaleString()}</div>
                                                    <div>Duration: {durationHours} h</div>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </Section>

            </Paper>

            {/* ➕ Modal za dodavanje kvara */}
            <Dialog
                open={showAddMalfunction}
                onClose={() => setShowAddMalfunction(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add Malfunction</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newMalfunction.description}
                        onChange={(e) =>
                            setNewMalfunction({ description: e.target.value })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddMalfunction(false)}>Cancel</Button>
                    <Button onClick={handleAddMalfunction} variant="contained">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const Detail = ({ label, value }) => (
    <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body1">{value || "—"}</Typography>
    </Grid>
);

const Section = ({ title, children, actions }) => (
    <Box sx={{ mb: 3 }}>
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 1,
            }}
        >
            <Typography variant="h5" fontWeight="bold">
                {title}
            </Typography>
            {actions}
        </Box>
        {children}
    </Box>
);

export default VehicleDetailsPage;
