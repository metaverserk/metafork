import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


// Получение постов от подписок
export const getAllPosts = (requestData) => {
    return axios.post(`${API_URL}/posts/feed`, requestData, {
        withCredentials: true,
    });
};

// Получение всех постов с типом
export const getFollowingPosts = (requestData) => {
    return axios.post(`${API_URL}/posts/`, requestData, {
        withCredentials: true,
    });
};

// Получение постов по тегу
export const getSearchPosts = (requestData) => {
    return axios.post(`${API_URL}/posts/search`, requestData, {
        withCredentials: true,
    });
};

// Пагинация постов от подписок
export const getAllPostsPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/posts/feed?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
        }
    );
};

// Пагинация всех постов с типом
export const getFollowingPostsPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/posts?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
        }
    );
};

// Пагинация постов по тегу
export const getSearchPostsPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/posts/search?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
    });
};

// Получение данных о посте
export const getPost = (requestData) => {
    return axios.post(`${API_URL}/posts/post`, requestData, {
        withCredentials: true,
    });
};

// Получение данных о комментариях поста
export const getComments = (requestData) => {
    return axios.post(`${API_URL}/comments`, requestData, {
        withCredentials: true,
    });
};

// Пагинация комментариев
export const getCommentsPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/comments/?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
    });
};

// Создание комментария
export const createPostComment = (newCommentData) => {
    return axios.post(`${API_URL}/comments/create/`, newCommentData, {
        withCredentials: true,
    });
};

// Удаление комментария с поста
export const deletePostComment = (requestData) => {
    return axios.post(`${API_URL}/comments/delete`, requestData, {
        withCredentials: true,
    });
};

// Получение ответов на комментарии
export const getReply = (requestData) => {
    return axios.post(`${API_URL}/reply`, requestData, {
        withCredentials: true,
    });
}

// Пагинация ответов
export const getReplyPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/reply?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
        }
    );
};

// Удаление ответа с комментария
export const deleteReply = (requestData) => {
    return axios.post(`${API_URL}/reply/delete`, requestData, {
        withCredentials: true,
    });
};

// Создание ответа на комментарий
export const createReply = (newReplyData) => {
    return axios.post(`${API_URL}/reply/create/`, newReplyData, {
        withCredentials: true,
    });
};