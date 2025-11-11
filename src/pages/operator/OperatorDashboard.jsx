import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";

import RentalsPage from "./RentalsPage";
import VehiclesMapPage from "./VehiclesMapPage";
import ReportMalfunctionPage from "./ReportMalfunctionPage";
import ClientsPage from "./ClientsPage";

const OperatorDashboard = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout role="OPERATOR" />}>
                <Route index element={<RentalsPage />} />
                <Route path="rentals" element={<RentalsPage />} />
                <Route path="map" element={<VehiclesMapPage />} />
                <Route path="report-malfunction" element={<ReportMalfunctionPage />} />
                <Route path="clients" element={<ClientsPage />} />
            </Route>
        </Routes>
    );
};

export default OperatorDashboard;
