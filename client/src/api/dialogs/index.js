import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


// Получение всех диалогов пользователя
export const getDialogs = (requestData) => {
    return axios.post(`${API_URL}/dialogs`, requestData, {
        withCredentials: true,
    });
};

// Пагинация диалогов пользователя
export const getDialogsPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/dialogs?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
    });
};

// Получение сообщений
export const getMessages = (requestData) => {
    return axios.post(`${API_URL}/dialogs/messages`, requestData, {
        withCredentials: true,
    })
};

// Получение информации о пользователе
export const getDialogUserData = (requestData) => {
    return axios.post(`${API_URL}/dialogs/user`, requestData, {
        withCredentials: true,
    })
};

// Пагинация сообщений
export const getMessagesPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/dialogs/messages?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
    })
};

// Отправка сообщений
export const createMessage = (requestData) => {
    return axios.post(`${API_URL}/dialogs/create`, requestData, {
        withCredentials: true,
    })
};

// Прочтение сообщений
export const readMessages = (requestData) => {
    return axios.post(`${API_URL}/dialogs/read`, requestData, {
        withCredentials: true,
    })
};