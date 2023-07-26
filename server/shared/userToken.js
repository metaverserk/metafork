import jwt from 'jsonwebtoken'

export const userToken = (userToken) => {

    const decodedToken = jwt.decode(userToken); // Расшифровываем токен
    const userId = decodedToken.id;

    return userId;
}