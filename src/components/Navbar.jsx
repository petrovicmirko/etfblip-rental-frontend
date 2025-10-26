import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = ({ onLogout }) => {
    return (
        <Box
            sx={{
                backgroundColor: "#2C3E50",
                color: "#ECF0F1",
                px: 3,
                py: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Typography variant="h6" fontWeight="bold">Rental system</Typography>
            <IconButton
                onClick={onLogout}
                sx={{
                    color: "#ECF0F1",
                    "&:hover": { color: "#1ABC9C" },
                }}
            >
                <LogoutIcon />
            </IconButton>
        </Box>
    );
};

export default Navbar;
