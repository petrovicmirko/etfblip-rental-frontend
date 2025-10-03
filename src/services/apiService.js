import httpApi from "../http/httpApi";

export const getVehicles = async () => {
    const response = await httpApi.get("/api/vehicles");
    return response.data;
};

export const getVehicleById = async (id) => {
    const response = await httpApi.get(`/api/vehicles/${id}`);
    return response.data;
};

export const createVehicle = async (vehicle) => {
    const response = await httpApi.post("/api/vehicles", vehicle);
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

export const getManufacturers = async () => {
    const response = await httpApi.get("/api/manufacturers");
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
