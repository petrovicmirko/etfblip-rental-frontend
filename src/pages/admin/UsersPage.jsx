import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
} from "@mui/material";
import { getAllEmployees, getAllClients } from "../../services/apiService";

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState("EMPLOYEES");
    const [employees, setEmployees] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empData, clientData] = await Promise.all([
                    getAllEmployees(),
                    getAllClients(),
                ]);
                setEmployees(empData);
                setClients(clientData);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                User Management
            </Typography>

            {/* === Tabs === */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 3,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Employees" value="EMPLOYEES" />
                    <Tab label="Clients" value="CLIENTS" />
                </Tabs>
            </Box>

            {/* === Employees Table === */}
            {activeTab === "EMPLOYEES" && (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    Username
                                </TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    Role
                                </TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    Email
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.map((emp) => (
                                    <TableRow key={emp.id} hover>
                                        <TableCell>{emp.username}</TableCell>
                                        <TableCell>{emp.role}</TableCell>
                                        <TableCell>{emp.email}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* === Clients Table === */}
            {activeTab === "CLIENTS" && (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    Username
                                </TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    Email
                                </TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    Phone
                                </TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    Address
                                </TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    ID Card
                                </TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    Driver License
                                </TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                    Date of Birth
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No clients found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clients.map((client) => (
                                    <TableRow key={client.id} hover>
                                        <TableCell>{client.username}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.phone}</TableCell>
                                        <TableCell>
                                            {client.clientDetails?.address || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {client.clientDetails?.idCardNumber || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {client.clientDetails?.driverLicenseNumber || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {client.clientDetails?.dateOfBirth || "-"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default UsersPage;
