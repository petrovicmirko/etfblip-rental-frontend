import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";

import RentalsPage from "./RentalsPage";
import VehiclesMapPage from "./VehiclesMapPage";
import ReportMalfunctionPage from "./ReportMalfunctionPage";

const OperatorDashboard = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout role="OPERATOR" />}>
                <Route index element={<RentalsPage />} />
                <Route path="rentals" element={<RentalsPage />} />
                <Route path="map" element={<VehiclesMapPage />} />
                <Route path="report-malfunction" element={<ReportMalfunctionPage />} />
                {/* <Route path="clients" element={<h2>Clients page</h2>} /> */} // import after creating the page on admin side
            </Route>
        </Routes>
    );
};

export default OperatorDashboard;
