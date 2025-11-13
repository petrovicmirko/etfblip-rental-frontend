import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    TextField,
    MenuItem,
    Paper,
} from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts";
import {
    getRentalsStatistics,
    getRevenueByVehicleType,
    getDamageStatistics,
} from "../../services/apiService";

const StatisticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dailyRevenue, setDailyRevenue] = useState([]);
    const [vehicleDamages, setVehicleDamages] = useState([]);
    const [revenueByType, setRevenueByType] = useState([]);

    const [month, setMonth] = useState(new Date().getMonth() + 1);

    // 🔹 Učitavanje svih statistika (prihodi + kvarovi)
    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            setError(null);

            try {
                // ✅ Dnevni prihod
                const rentalsStats = await getRentalsStatistics(month);
                setDailyRevenue(rentalsStats);

                // ✅ Prihod po tipu vozila
                const revenueTypeData = await getRevenueByVehicleType();
                setRevenueByType(revenueTypeData);

                // ✅ Broj kvarova po vozilu
                const damageStats = await getDamageStatistics();
                setVehicleDamages(damageStats);

            } catch (err) {
                console.error("Error fetching statistics:", err);
                setError("Failed to load statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [month]);

    if (loading)
        return <CircularProgress sx={{ display: "block", mx: "auto", mt: 8 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
                📊 Vehicle Rental Statistics
            </Typography>

            {/* 🔹 Odabir mjeseca */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <TextField
                    select
                    label="Select Month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    sx={{ width: 200 }}
                    size="small"
                >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <MenuItem key={m} value={m}>
                            {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* 🔹 Grafikon 1 — Ukupan prihod po danima */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Daily Revenue
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#1976d2"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>

            {/* 🔹 Grafikon 2 — Oštećenja po vozilu */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Damages per Vehicle
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vehicleDamages}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="vehicle" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="damages" fill="#d32f2f" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            {/* 🔹 Grafikon 3 — Prihod po tipu vozila */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Revenue by Vehicle Type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueByType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#388e3c" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default StatisticsPage;
