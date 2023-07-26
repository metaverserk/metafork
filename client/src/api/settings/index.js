import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


// Обновление настроек
export const updateSettings = (requestData) => {
    return axios.post(`${API_URL}/users/update/`, requestData, {
        withCredentials: true,
    });
};

// Обновление настроек
export const updateSocial = (requestData) => {
    return axios.post(`${API_URL}/users/social`, requestData, {
        withCredentials: true,
    });
};