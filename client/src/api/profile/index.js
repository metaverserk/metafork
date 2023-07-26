import axios from "axios";
import Compressor from 'compressorjs';
import showNotification from "../../components/Notify";

const API_URL = process.env.REACT_APP_API_URL;
const TON_URL = "https://tonapi.io/v2/accounts/";

// Получение данных пользователя
export const getUserProfile = (requestData) => {
    try {
        return axios.post(`${API_URL}/users/profile`, requestData, {
            withCredentials: true,
        });
    } catch (error) {
        console.error(error);
    }
};

// Получение постов пользователя
export const getUserPosts = (requestData) => {
    return axios.post(`${API_URL}/posts/user`, requestData, {
        withCredentials: true,
    });
};

// Пагинация постов
export const getUserPostsPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/posts/user/?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
        }
    );
};

// Создание поста
export const createUserPost = (newPostData) => {
    return axios.post(`${API_URL}/posts/create/`, newPostData, {
        withCredentials: true,
    });
};

// Редактирование
export const editUserPost = (requestData) => {
    return axios.post(`${API_URL}/posts/edit/`, requestData, {
        withCredentials: true,
    });
};

//Удаление поста пользователя
export const deleteUserPost = (requestData) => {
    return axios.post(`${API_URL}/posts/delete`, requestData, {
        withCredentials: true,
    });
};

// Получение подписчиков пользователя
export const getFollowers = (requestData) => {
    return axios.post(`${API_URL}/subscribe/followers/`, requestData, {
        withCredentials: true,
    });
};

// Пагинация подписчиков
export const getFollowersPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/subscribe/followers/?page=${currentPage + 1}`, requestData, {
        withCredentials: true,
        }
    );
};

// Получение подписок пользователя
export const getFollowing = (requestData) => {
    return axios.post(`${API_URL}/subscribe/following/`, requestData, {
        withCredentials: true,
    });
};

// Пагинация подписок пользователя
export const getFollowingPage = (currentPage, requestData) => {
    return axios.post(`${API_URL}/subscribe/following/?page=${currentPage + 1}`, requestData,{
        withCredentials: true,
        }
    );
};

// Получение количества NFT пользователя
export const getNftCount = async (wallet) => {
    try {
        const response = await axios.get(`${TON_URL}${wallet}/nfts?indirect_ownership=true`, {
            'Authorization': 'AFNWXUMLAJ2I74IAAAAILNPGIJZ6UEFLEMRCUVMYK7GCJXTN7ZQ6D53GAVVUC37T2STMURA',
        });
        return {response};
    } catch (error) {
        console.log(error);
    }
};

// Получение NFT пользователя
export const getNft = async (wallet, limit) => {
    try {
        const response = await axios.get(`${TON_URL}${wallet}/nfts?indirect_ownership=true&limit=${limit}`, {
            'Authorization': 'AFNWXUMLAJ2I74IAAAAILNPGIJZ6UEFLEMRCUVMYK7GCJXTN7ZQ6D53GAVVUC37T2STMURA',
        });
        const newLimit = parseInt(limit) + 30;
        return {response, newLimit};
    } catch (error) {
        console.log(error);
    }
};

// Получение Жетонов пользователя
export const getJettons = async (wallet) => {
    try {
        const response = await axios.get(`${TON_URL}${wallet}/jettons`, {
            'Authorization': 'AFNWXUMLAJ2I74IAAAAILNPGIJZ6UEFLEMRCUVMYK7GCJXTN7ZQ6D53GAVVUC37T2STMURA',
        });
        return {response};
    } catch (error) {
        console.log(error);
    }
};

// // Загрузка аватарки
export const uploadAvatar = (file) => {

    // Проверка на расширение файла
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        showNotification('Неверное расширение файла');
        return;
    }

    const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 Мб

    // Проверка на размер файла
    if (file.size > MAX_FILE_SIZE) {
        showNotification('Допустимый размер файла 30 мб');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload/avatar/`, formData, {
    withCredentials: true,
    }); 
};


//Загрузка изображения к посту
export const uploadPostImage = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload/image/`, formData, {
    withCredentials: true,
    }); 
};

//Загрузка видео к посту
export const uploadPostVideo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload/video/`, formData, {
        withCredentials: true,
    });  
};

// Обновление ссылки на аватар
export const changeAvatarUrl = (requestData) => {
    return axios.post(`${API_URL}/users/avatar/`, requestData, {
        withCredentials: true,
    });
};