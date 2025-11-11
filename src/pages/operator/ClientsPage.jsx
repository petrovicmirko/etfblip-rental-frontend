import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
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
    Chip,
} from "@mui/material";
import { getAllClients, toggleBlockClient } from "../../services/apiService";

const ClientsPage = () => {
    const [clientsPage, setClientsPage] = useState({ content: [], totalPages: 0 });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 5;

    const fetchClients = async () => {
        setLoading(true);
        try {
            const data = await getAllClients(page - 1, pageSize);
            setClientsPage(data);
        } catch (err) {
            console.error("❌ Error fetching clients:", err);
            setError("Failed to load clients data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [page]);

    const handleToggleBlock = async (clientId) => {
        try {
            const updatedClient = await toggleBlockClient(clientId);
            setClientsPage((prev) => ({
                ...prev,
                content: prev.content.map((c) =>
                    c.id === clientId ? updatedClient : c
                ),
            }));
            alert(`✅ Client ${updatedClient.blocked ? "blocked" : "unblocked"} successfully!`);
        } catch (err) {
            console.error("❌ Failed to toggle block client:", err);
            alert("❌ Failed to toggle block client. Check console for details.");
        }
    };

    const renderPagination = (totalPages) => (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
            />
        </Box>
    );

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
                Clients Management
            </Typography>

            <TableContainer component={Paper} elevation={3}>
                <Table
                    sx={{
                        tableLayout: "fixed",
                        width: "100%",
                        "& th, & td": {
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 160,
                        },
                    }}
                >
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "15%" }}>
                                Username
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "15%" }}>
                                Email
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "10%" }}>
                                Phone
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "15%" }}>
                                Address
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "10%" }}>
                                ID Card
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "10%" }}>
                                Driver License
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "10%" }}>
                                Date of Birth
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "15%" }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {clientsPage.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    No clients found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            clientsPage.content.map((client) => (
                                <TableRow key={client.id} hover>
                                    <TableCell>{client.username}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.phone}</TableCell>
                                    <TableCell>{client.clientDetails?.address || "-"}</TableCell>
                                    <TableCell>{client.clientDetails?.idCardNumber || "-"}</TableCell>
                                    <TableCell>{client.clientDetails?.driverLicenseNumber || "-"}</TableCell>
                                    <TableCell>{client.clientDetails?.dateOfBirth || "-"}</TableCell>
                                    <TableCell
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Chip
                                            label={client.blocked ? "Blocked" : "Active"}
                                            color={client.blocked ? "error" : "success"}
                                            onClick={() => handleToggleBlock(client.id)}
                                            clickable
                                            sx={{
                                                width: 80,
                                                textAlign: "center",
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {renderPagination(clientsPage.totalPages)}
        </Container>
    );
};

export default ClientsPage;
