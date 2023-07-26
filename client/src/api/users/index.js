import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


// Получение списка пользователей
export const getUsers = (requestData) => {
    return axios.post(`${API_URL}/users`, requestData, {
        withCredentials: true,
    });
};

// Пагинация пользователей
export const getUsersPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/users?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
        }
    );
};