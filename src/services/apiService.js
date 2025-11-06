import httpApi from "../http/httpApi";

/// TODO: Handle later

// export const getVehicles = async () => {
//     const response = await httpApi.get("/api/vehicles");
//     return response.data;
// };

export const getVehicles = async (page = 0, size = 5, sortBy = "id", direction = "asc") => {
    const response = await httpApi.get("/api/vehicles", {
        params: { page, size, sortBy, direction },
    });
    return response.data;
};

export const getCars = async (page = 0, size = 5, sortBy = "id", direction = "asc") => {
    const response = await httpApi.get("/api/vehicles/cars", {
        params: { page, size, sortBy, direction },
    });
    return response.data;
};

export const getScooters = async (page = 0, size = 5, sortBy = "id", direction = "asc") => {
    const response = await httpApi.get("/api/vehicles/scooters", {
        params: { page, size, sortBy, direction },
    });
    return response.data;
};

export const getBicycles = async (page = 0, size = 5, sortBy = "id", direction = "asc") => {
    const response = await httpApi.get("/api/vehicles/bicycles", {
        params: { page, size, sortBy, direction },
    });
    return response.data;
};

export const getVehicleById = async (id) => {
    const response = await httpApi.get(`/api/vehicles/${id}`);
    return response.data;
};

export const addVehicle = async (vehicle) => {
    const response = await httpApi.post("/api/vehicles/add", vehicle);
    return response.data;
};

export const updateVehicle = async (id, vehicle) => {
    const response = await httpApi.put(`/api/vehicles/${id}`, vehicle);
    return response.data;
};

export const deleteVehicle = async (id) => {
    const response = await httpApi.delete(`/api/vehicles/${id}`);
    return response.data;
};

export const getAllManufacturers = async () => {
    const response = await httpApi.get("/api/manufacturers/all");
    return response.data;
};

export const getManufacturers = async (page = 0, size = 5, sortBy = "id", direction = "asc") => {
    const response = await httpApi.get("/api/manufacturers", {
        params: { page, size, sortBy, direction },
    });
    return response.data;
};

export const createManufacturer = async (manufacturer) => {
    const response = await httpApi.post("/api/manufacturers", manufacturer);
    return response.data;
};

export const updateManufacturer = async (id, manufacturer) => {
    const response = await httpApi.put(`/api/manufacturers/${id}`, manufacturer);
    return response.data;
};

export const deleteManufacturer = async (id) => {
    await httpApi.delete(`/api/manufacturers/${id}`);
};

export const getAllClients = async () => {
    const res = await httpApi.get(`/api/users/clients`);
    return res.data;
};

export const getAllEmployees = async () => {
    const res = await httpApi.get(`/api/users/employees`);
    return res.data;
};

export const blockClient = async (id) => {
    await httpApi.put(`/api/users/clients/${id}/block`);
};

export const unblockClient = async (id) => {
    await httpApi.put(`/users/clients/${id}/unblock`);
};

export const addEmployee = async (data) => {
    const res = await httpApi.post(`/users/employees`, data);
    return res.data;
};

export const updateEmployee = async (id, data) => {
    const res = await httpApi.put(`/users/employees/${id}`, data);
    return res.data;
};

export const deleteEmployee = async (id) => {
    await httpApi.delete(`/users/employees/${id}`);
};

export const getVehicleMalfunctions = (vehicleId) =>
    httpApi.get(`/api/damages/${vehicleId}`).then((res) => res.data);

export const addVehicleMalfunction = (vehicleId, failureData) =>
    httpApi.post(`/api/damages/${vehicleId}`, failureData).then((res) => res.data);

export const deleteVehicleMalfunction = (damageId) =>
    httpApi.delete(`/api/damages/${damageId}`).then((res) => res.data);

export const fixVehicle = (vehicleId) =>
    httpApi.put(`/api/vehicles/fix/${vehicleId}`).then((res) => res.data);

export const getVehicleRentals = async (vehicleId) => {
    const response = await httpApi.get(`/api/rentals/${vehicleId}`);
    return response.data;
};
