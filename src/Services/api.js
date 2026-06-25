import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const getProducts = async (params = {}) => {
    const response = await api.get("/products", {
        params: {
            limit: params.limit ?? 20,
            cursor: params.cursor ?? null,
            category: params.category ?? null,
        },
    });

    return response.data;
};

export default api;