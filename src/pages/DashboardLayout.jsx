import { Outlet, NavLink, useNavigate } from "react-router-dom";

const DashboardLayout = ({ role: propRole }) => {
    const navigate = useNavigate();
    const role = propRole || localStorage.getItem("role") || "OPERATOR";

    const logout = () => {
        localStorage.clear();
        navigate("/login");
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
            { to: "/manager/report-malfunction", label: "Report malfunction" },
        ],
    };

    const roleMenu = menus[role] || [];

    return (
        <div className="layout-root">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-top">
                    <div className="brand" onClick={() => navigate(`/${role.toLowerCase()}`)}>
                        <div className="brand-logo">⚡</div>
                        <div className="brand-text">ETFBL_IP</div>
                    </div>
                </div>

                <nav className="menu">
                    <div className="menu-section-title">{role} panel</div>
                    {roleMenu.map((m) => (
                        <NavLink
                            key={m.to}
                            to={m.to}
                            className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
                        >
                            <span className="menu-label">{m.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div className="sidebar-user">Uloga: <strong>{role}</strong></div>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            </aside>

            {/* Main content */}
            <main className="main">
                <header className="topbar">
                    <div className="topbar-left">
                        <h3 className="page-title">Welcome, {role}</h3>
                    </div>
                    <div className="topbar-right">
                        <span className="app-name">🚀 Rental System</span>
                        <button className="logout-inline" onClick={logout}>Logout</button>
                    </div>
                </header>

                <section className="content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
};

export default DashboardLayout;
