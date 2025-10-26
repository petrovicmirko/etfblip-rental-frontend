import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";

import StatisticsPage from "./StatisticsPage";
import PricingPage from "./PricingPage";

import VehiclesPage from "../admin/VehiclesPage";
import UsersPage from "../admin/UsersPage";
import ManufacturersPage from "../admin/ManufacturersPage";

import RentalsPage from "../operator/RentalsPage";
import VehiclesMapPage from "../operator/VehiclesMapPage";
import ReportMalfunctionPage from "../operator/ReportMalfunctionPage";
import VehicleDetailsPage from "../admin/VehicleDetailsPage";

const ManagerDashboard = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout role="MANAGER" />}>
                <Route index element={<Navigate to="statistics" replace />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="manufacturers" element={<ManufacturersPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="rentals" element={<RentalsPage />} />
                <Route path="map" element={<VehiclesMapPage />} />
                <Route path="report-malfunction" element={<ReportMalfunctionPage />} />

                <Route path="vehicles/vehicleDetails" element={<VehicleDetailsPage />} />
            </Route>
        </Routes>
    );
};

export default ManagerDashboard;
