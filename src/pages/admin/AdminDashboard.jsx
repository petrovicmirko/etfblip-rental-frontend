import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";

import VehiclesPage from "./VehiclesPage";
import UsersPage from "./UsersPage";
import ManufacturersPage from "./ManufacturersPage";

const AdminDashboard = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout role="ADMIN" />}>
                <Route index element={<VehiclesPage />} />
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="manufacturers" element={<ManufacturersPage />} />
            </Route>
        </Routes>
    );
};

export default AdminDashboard;
