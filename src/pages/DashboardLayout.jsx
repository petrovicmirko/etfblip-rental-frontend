import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";

const DashboardLayout = ({ role: propRole }) => {
    const role = propRole || localStorage.getItem("role") || "OPERATOR";

    const logout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    const menus = {
        ADMIN: [
            { to: "/admin/vehicles", label: "Vehicles" },
            { to: "/admin/manufacturers", label: "Manufacturers" },
            { to: "/admin/users", label: "Users" },
        ],
        OPERATOR: [
            { to: "/operator/rentals", label: "Rentals" },
            { to: "/operator/map", label: "Map" },
            { to: "/operator/clients", label: "Clients" },
            { to: "/operator/report-malfunction", label: "Report malfunction" },
        ],
        MANAGER: [
            { to: "/manager/statistics", label: "Statistics" },
            { to: "/manager/pricing", label: "Pricing" },
            { to: "/manager/vehicles", label: "Vehicles" },
            { to: "/manager/manufacturers", label: "Manufacturers" },
            { to: "/manager/users", label: "Users" },
            { to: "/manager/rentals", label: "Rentals" },
            { to: "/manager/map", label: "Map" },
            { to: "/manager/clients", label: "Clients" },
            { to: "/manager/report-malfunction", label: "Report malfunction" },
        ],
    };

    const roleMenu = menus[role] || [];

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#ECF0F1" }}>
            <Sidebar role={role} menuItems={roleMenu} />

            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Navbar onLogout={logout} />
                <Box sx={{ p: 3, flexGrow: 1 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
