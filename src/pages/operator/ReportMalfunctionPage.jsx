import React, { useState } from "react";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { addVehicleMalfunction } from "../../services/apiService";

const ReportMalfunctionPage = () => {
    const [externalId, setExternalId] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true);

        try {
            const result = await addVehicleMalfunction(externalId, description);
            setMessage(`Malfunction for vehicle ${externalId} reported successfully!`);
            setExternalId("");
            setDescription("");
        } catch (err) {
            setError(err.error || "Failed to report malfunction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }} elevation={3}>
                <Typography variant="h4" mb={3} textAlign="center">
                    Report Vehicle Malfunction
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="External ID"
                        fullWidth
                        margin="normal"
                        value={externalId}
                        onChange={(e) => setExternalId(e.target.value)}
                        required
                    />
                    <TextField
                        label="Malfunction Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <Box textAlign="center" mt={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Report"}
                        </Button>
                    </Box>
                </form>

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

export default ReportMalfunctionPage;
