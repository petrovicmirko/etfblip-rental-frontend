import { useState } from "react";
import httpApi from "../http/httpApi";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken, setRole }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await httpApi.post("/auth/login", { username, password });
            const data = response.data;
            console.log("Login response:", data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            setToken(data.token);
            setRole(data.role);

            // alert(`Prijava uspješna! 🎉\nUloga: ${data.role}`);

            if (data.role === "ADMIN") {
                navigate("/admin");
                console.log("Navigating to /admin with role:", data.role);
            } else if (data.role === "OPERATOR") {
                navigate("/operator");
                console.log("Navigating to /operator with role:", data.role);
            } else if (data.role === "MANAGER") {
                navigate("/manager");
            } else {
                navigate("/dashboard");
                console.log("Navigating to /dashboard with role:", data.role);
            }

        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert("Neispravni podaci za prijavu ❌");
            } else {
                console.error(err);
                alert("Ne mogu da se povežem sa serverom.");
            }
        }
    };

    return (
        <div
            style={{
                top: 0,
                left: 0,
                position: "fixed",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                display: "flex",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
        >

            <h1
                style={{
                    color: "#fff",
                    marginBottom: "50px",
                    textAlign: "center",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                }}
            >
                Dobrodošli!
            </h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    padding: "40px",
                    borderRadius: "15px",
                    width: "350px",
                    background: "rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                }}
            >
                <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "10px" }}>
                    Prijava
                </h2>
                <input
                    type="text"
                    placeholder="Korisničko ime"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        outline: "none",
                    }}
                />
                <input
                    type="password"
                    placeholder="Lozinka"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        outline: "none",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "none",
                        background: "linear-gradient(90deg, #667eea, #764ba2)",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                    onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
                    Prijavi se
                </button>
            </form>
        </div>
    );
};

export default Login;
