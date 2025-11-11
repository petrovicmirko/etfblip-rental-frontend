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

export const getAllEmployees = async (page = 0, size = 5) => {
    const res = await httpApi.get(`/api/users/employees`, {
        params: { page, size },
    });
    return res.data;
};

export const getAllClients = async (page = 0, size = 5) => {
    const res = await httpApi.get(`/api/users/clients`, {
        params: { page, size },
    });
    return res.data;
};

export const toggleBlockClient = async (id) => {
    const response = await httpApi.put(`/api/users/block/${id}`);
    return response.data;
};

export const addEmployee = async (data) => {
    const res = await httpApi.post(`/users/employees`, data);
    return res.data;
};

export const updateEmployee = async (id, data) => {
    const res = await httpApi.put(`/api/users/${id}`, data);
    return res.data;
};

export const deleteEmployee = async (id) => {
    await httpApi.delete(`/api/users/${id}`);
};

export const getVehicleMalfunctions = (vehicleId) =>
    httpApi.get(`/api/damages/${vehicleId}`).then((res) => res.data);

export const addVehicleMalfunction = (externalIdId, description) =>
    httpApi.post(`/api/damages/${externalIdId}`, { description, }).then((res) => res.data);

export const deleteVehicleMalfunction = (damageId) =>
    httpApi.delete(`/api/damages/${damageId}`).then((res) => res.data);

export const fixVehicle = (vehicleId) =>
    httpApi.put(`/api/vehicles/fix/${vehicleId}`).then((res) => res.data);

export const getVehicleRentals = async (vehicleId) => {
    const response = await httpApi.get(`/api/rentals/${vehicleId}`);
    return response.data;
};

export const getAllRentals = async () => {
    const response = await httpApi.get(`/api/rentals`);
    return response.data;
};

export const reportMalfunction = async (externalId, description) => {
    try {
        const response = await httpApi.post(`api/vehicles/malfunction`, {
            externalId,
            description,
        });
        return response.data;
    } catch (error) {
        console.error("Error reporting malfunction:", error);
        throw error.response?.data || { error: "Failed to report malfunction" };
    }
};
