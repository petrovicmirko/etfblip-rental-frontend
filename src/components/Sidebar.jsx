import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, List, ListItemButton, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Sidebar = ({ role, menuItems }) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Box
            sx={{
                width: collapsed ? 60 : 220,
                backgroundColor: "#34495E",
                color: "#ECF0F1",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.3s",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: collapsed ? "center" : "flex-end", p: 1 }}>
                <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#ECF0F1" }}>
                    {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </Box>

            <List sx={{ flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.to}
                        onClick={() => navigate(item.to)}
                        sx={{
                            color: "#ECF0F1",
                            justifyContent: collapsed ? "center" : "flex-start",
                            px: collapsed ? 0 : 2,
                            "&:hover": { backgroundColor: "#3E556E" },
                        }}
                        component={NavLink}
                        to={item.to}
                    >
                        <ListItemText
                            primary={item.label}
                            sx={{ opacity: collapsed ? 0 : 1 }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
