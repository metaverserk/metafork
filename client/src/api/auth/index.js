import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Авторизация пользователя
export const authUser = (authWallet) => {
    return axios.post(`${API_URL}/auth`, authWallet, {
        withCredentials: true,
    });
};

// Логаут пользователя
export const logOut = () => {
    return axios.post(`${API_URL}/auth/logout`, {
        withCredentials: true,
        credentials: 'include'
    });
};