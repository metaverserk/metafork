import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


// Подписка на пользователя
export const addFollow = (requestData) => {
    return axios.post(`${API_URL}/subscribe/follow/`, requestData, {
        withCredentials: true,
    })
};

// Отписка от пользователя
export const deleteFollow = (requestData) => {
    return axios.post(`${API_URL}/subscribe/unfollow/`, requestData, {
        withCredentials: true,
    });
};

// Поставить лайк на пост
export const addLikePost = (requestData) => {
    return axios.post(`${API_URL}/likes/add/`, requestData, {
        withCredentials: true,
    });
};

// Удалить лайк с поста
export const deleteLikePost = (requestData) => {
    return axios.post(`${API_URL}/likes/delete/`, requestData, {
        withCredentials: true,
    });
};