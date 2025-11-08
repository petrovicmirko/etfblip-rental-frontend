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
    Pagination,
    IconButton,
    Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import { getAllEmployees, getAllClients, deleteEmployee, toggleBlockClient } from "../../services/apiService";
import AddEmployeePopup from "../../components/AddEmployeePopup";

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState("EMPLOYEES");
    const [employeesPage, setEmployeesPage] = useState({ content: [], totalPages: 0 });
    const [clientsPage, setClientsPage] = useState({ content: [], totalPages: 0 });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 5;

    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "EMPLOYEES") {
                const data = await getAllEmployees(page - 1, pageSize);
                setEmployeesPage(data);
            } else {
                const data = await getAllClients(page - 1, pageSize);
                setClientsPage(data);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load user data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, page]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await deleteEmployee(id);
                alert("✅ Employee deleted successfully!");
                fetchData();
            } catch (err) {
                console.error("❌ Failed to delete employee:", err);
                alert("❌ Failed to delete employee. Check console for details.");
            }
        }
    };

    const handleEdit = (user, e) => {
        e.stopPropagation();
        setSelectedEmployee(user);
        setPopupOpen(true);
    };

    const handleToggleBlock = async (clientId) => {
        try {
            const updatedClient = await toggleBlockClient(clientId);

            setClientsPage(prev => ({
                ...prev,
                content: prev.content.map(c =>
                    c.id === clientId ? updatedClient : c
                )
            }));

            alert(`✅ Client ${updatedClient.blocked ? "blocked" : "unblocked"} successfully!`);
        } catch (err) {
            console.error("❌ Failed to toggle block client:", err);
            alert("❌ Failed to toggle block client. Check console for details.");
        }
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                User Management
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
                        setPage(1);
                    }}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Employees" value="EMPLOYEES" />
                    <Tab label="Clients" value="CLIENTS" />
                </Tabs>

                {activeTab === "EMPLOYEES" && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedEmployee(null);
                            setPopupOpen(true);
                        }}
                    >
                        Add Employee
                    </Button>
                )}
            </Box>

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
                            {activeTab === "EMPLOYEES" ? (
                                <>
                                    <TableCell sx={{ color: "white", fontWeight: "bold", width: "30%" }}>
                                        Username
                                    </TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold", width: "25%" }}>
                                        Role
                                    </TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold", width: "25%" }}>
                                        Email
                                    </TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold", width: "20%" }}>
                                        Actions
                                    </TableCell>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {activeTab === "EMPLOYEES" ? (
                            employeesPage.content.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employeesPage.content.map((emp) => (
                                    <TableRow key={emp.id} hover>
                                        <TableCell>{emp.username}</TableCell>
                                        <TableCell>{emp.role}</TableCell>
                                        <TableCell>{emp.email}</TableCell>
                                        <TableCell sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                                            <IconButton color="primary" size="small" onClick={(e) => handleEdit(emp, e)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={(e) => handleDelete(emp.id, e)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        ) : clientsPage.content.length === 0 ? (
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
                                    <TableCell sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
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

            {renderPagination(activeTab === "EMPLOYEES" ? employeesPage.totalPages : clientsPage.totalPages)}
            {popupOpen && (
                <AddEmployeePopup
                    onClose={() => setPopupOpen(false)}
                    initialData={selectedEmployee}
                    onEmployeeSaved={() => fetchData()}
                    mode={selectedEmployee ? "edit" : "add"}
                />
            )}
        </Container>

    );

};

export default UsersPage;
