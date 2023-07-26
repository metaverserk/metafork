import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


// Получение уведомлений
export const getNotify = (requestData) => {
    return axios.post(`${API_URL}/notify/`, requestData, {
        withCredentials: true,
    })
};

// Прочтение уведомлений
export const readNotify = (requestData) => {
    return axios.post(`${API_URL}/notify/read`, requestData, {
        withCredentials: true,
    })
};

// Получение количества уведомлений
export const getNotifyCount = (requestData) => {
    return axios.post(`${API_URL}/notify/count`, requestData, {
        withCredentials: true,
    })
};

// Пагинация уведомлений
export const getNotifyPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/notify/?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
    })
};

//Уведомление сообщений
export const getMessageNotify = (requestData) => {
    return axios.post(`${API_URL}/notify/messages`, requestData, {
        withCredentials: true,
    })
};