import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Alert,
} from "@mui/material";
import { getAllRentals } from "../../services/apiService";

const RentalsPage = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const data = await getAllRentals();
                setRentals(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load rentals");
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                All Rentals
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Vehicle</strong></TableCell>
                            <TableCell><strong>User</strong></TableCell>
                            <TableCell><strong>Rent Start</strong></TableCell>
                            <TableCell><strong>Rent End</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rentals.map((rental) => (
                            <TableRow key={rental.id}>
                                <TableCell>
                                    {rental.vehicle ? `${rental.vehicle.manufacturer?.name || ""} ${rental.vehicle.model || ""}` : "—"}
                                </TableCell>
                                <TableCell>
                                    {rental.user ? `${rental.user.firstName || ""} ${rental.user.lastName || ""}` : "—"}
                                </TableCell>
                                <TableCell>{rental.rentStart?.replace("T", " ")}</TableCell>
                                <TableCell>{rental.rentEnd?.replace("T", " ")}</TableCell>
                                <TableCell>{(rental.priceCents / 100).toFixed(2)} €</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default RentalsPage;
