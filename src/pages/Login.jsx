import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    CircularProgress,
} from "@mui/material";
import httpApi from "../http/httpApi";

const Login = ({ setToken, setRole }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await httpApi.post("/auth/login", { username, password });
            const data = response.data;

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            setToken(data.token);
            setRole(data.role);

            if (data.role === "ADMIN") navigate("/admin");
            else if (data.role === "OPERATOR") navigate("/operator");
            else if (data.role === "MANAGER") navigate("/manager");
            else navigate("/dashboard");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert("Neispravni podaci za prijavu ❌");
            } else {
                console.error(err);
                alert("Ne mogu da se povežem sa serverom.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #1976d2 0%, #512da8 100%)",
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        textAlign: "center",
                        backgroundColor: "rgba(255,255,255,0.95)",
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                        color="primary"
                    >
                        Dobrodošli 👋
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                        Prijavite se na svoj nalog
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Korisničko ime"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Lozinka"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{
                                py: 1.2,
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textTransform: "none",
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Prijavi se"
                            )}
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
