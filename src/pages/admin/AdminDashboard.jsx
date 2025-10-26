import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";

import VehiclesPage from "./VehiclesPage";
import VehicleDetailsPage from "./VehicleDetailsPage";
import UsersPage from "./UsersPage";
import ManufacturersPage from "./ManufacturersPage";

const AdminDashboard = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout role="ADMIN" />}>
                <Route index element={<Navigate to="vehicles" replace />} />
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="vehicles/vehicleDetails" element={<VehicleDetailsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="manufacturers" element={<ManufacturersPage />} />
            </Route>
        </Routes>
    );
};

export default AdminDashboard;
