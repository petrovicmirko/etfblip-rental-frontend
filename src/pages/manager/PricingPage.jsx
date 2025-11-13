import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { getRentalPrice, updateRentalPrice } from "../../services/apiService";

const PricingPage = () => {
    const [prices, setPrices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const loadPrices = async () => {
        setLoading(true);
        try {
            const data = await getRentalPrice();
            setPrices(data);
        } catch (err) {
            setError("Failed to load rental prices.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrices();
    }, []);

    const handleChange = (e) => {
        setPrices({
            ...prices,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        setError(null);

        try {
            await updateRentalPrice(prices.id, {
                carPricePerHour: Number(prices.carPricePerHour),
                scooterPricePerHour: Number(prices.scooterPricePerHour),
                bicyclePricePerHour: Number(prices.bicyclePricePerHour),
            });

            setMessage("Pricing updated successfully!");
        } catch (err) {
            setError("Failed to update pricing.");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );

    if (!prices)
        return (
            <Alert severity="error" sx={{ mt: 4, mx: "auto", width: "fit-content" }}>
                Failed to load prices.
            </Alert>
        );

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }} elevation={3}>
                <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
                    Rental Pricing
                </Typography>

                <TextField
                    label="Car Price per Hour"
                    type="number"
                    name="carPricePerHour"
                    fullWidth
                    margin="normal"
                    value={prices.carPricePerHour}
                    onChange={handleChange}
                    inputProps={{ step: "0.1" }}
                />

                <TextField
                    label="Scooter Price per Hour"
                    type="number"
                    name="scooterPricePerHour"
                    fullWidth
                    margin="normal"
                    value={prices.scooterPricePerHour}
                    onChange={handleChange}
                    inputProps={{ step: "0.1" }}
                />

                <TextField
                    label="Bicycle Price per Hour"
                    type="number"
                    name="bicyclePricePerHour"
                    fullWidth
                    margin="normal"
                    value={prices.bicyclePricePerHour}
                    onChange={handleChange}
                    inputProps={{ step: "0.1" }}
                />

                <Box textAlign="center" mt={3}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        sx={{ px: 4 }}
                    >
                        {saving ? <CircularProgress size={24} /> : "Save Prices"}
                    </Button>
                </Box>

                {message && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                        {message}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}
            </Paper>
        </Box>
    );
};

export default PricingPage;
