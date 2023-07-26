import { db } from '../connect.js';
import { pagination } from '../shared/pagination.js';
import { userToken } from '../shared/userToken.js';
import { promisify } from 'util';

const queryPromise = promisify(db.query).bind(db);

// Получение данных о всех пользователях

export const getUsers = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;
    const searchParam = req.body.search;

    try {
        let query = `
            SELECT 
                u.id,
                ud.name,
                ud.status,
                ud.verify,
                ud.rating,
                u.avatar,
                u.wallet,
                u.avatarType,
                COUNT(DISTINCT followerId) AS followerCount, 
                EXISTS(SELECT 1 FROM subscribers WHERE followedId = u.id AND followerId = ?) AS followed 
            FROM users u 
            JOIN usersData ud ON u.id = ud.userId
            LEFT JOIN subscribers ON u.id = followedId 
        `;
        let queryParams = [authUserId];
        
        if (searchParam && searchParam.trim() !== '') {
            query += `WHERE ud.name LIKE ?`;
            queryParams.push(`%${searchParam}%`);
        }
        
        query += `
            GROUP BY u.id
            ORDER BY ud.rating DESC, followerCount DESC
        `;
        
        const rows = await queryPromise(query, queryParams);
        const result = rows.map((row) => ({
            ...row,
            followed: Boolean(row.followed),
        }));
        const page = parseInt(req.query.page);
        const limit = 10;
        const results = pagination(result, page, limit);
        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 


// Получение данных о профиле пользователя

export const getUser = async (req, res) => {
    const userId = req.body.userId; 
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;
    
    try {
        const query = `
            SELECT
                u.id,
                ud.name,
                ud.status,
                ud.verify,
                ud.rating,
                u.avatar,
                u.wallet,
                u.avatarType,
                us.*,
                COUNT(DISTINCT s1.followedId) AS followedCount,
                COUNT(DISTINCT s2.followerId) AS followerCount,
                EXISTS(SELECT 1 FROM subscribers s3 WHERE s3.followedId = u.id AND s3.followerId = ?) AS followed,
                (SELECT COUNT(*) FROM posts WHERE userId = u.id) AS postCount
            FROM users u
            JOIN usersData ud ON u.id = ud.userId
            LEFT JOIN subscribers s1 ON u.id = s1.followerId
            LEFT JOIN subscribers s2 ON u.id = s2.followedId
            LEFT JOIN usersSocial us ON u.id = us.userId
            WHERE u.id = ?
            GROUP BY u.id
        `;
        
        const rows = await queryPromise(query, [authUserId, userId]);
        if (rows.length === 0) {
          // выполнить код для обработки ошибки 404
          res.status(404).send('User not found');
          return;
        }
        const result = rows.map((row) => {

            const social = {
                ...(row.telegram && { telegram: row.telegram }),
                ...(row.instagram && { instagram: row.instagram }),
                ...(row.twitter && { twitter: row.twitter }),
                ...(row.discord && { discord: row.discord }),
                ...(row.youtube && { youtube: row.youtube }),
                ...(row.tiktok && { tiktok: row.tiktok }),
                ...(row.vk && { vk: row.vk }),
                ...(row.link && { link: row.link })
            };
            
            const socialArray = Object.values(social);

            return {
                avatar: row.avatar,
                avatarType: row.avatarType,
                followed: Boolean(row.followed),
                followedCount: row.followedCount,
                followerCount: row.followerCount,
                id: row.id,
                name: row.name,
                postCount: row.postCount,
                rating: row.rating,
                status: row.status,
                userId: row.userId,
                verify: row.verify,
                wallet: row.wallet,
                
                social: socialArray.every((value) => value === []) ? [] : [social]
            }
        });
        res.send(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

//Обновление аватара пользователя

export const changeAvatar = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = userToken(token);
    const avatarUrl = req.body.avatarUrl;
    const avatarType = req.body.avatarType;
    const updateQuery = "UPDATE users SET avatar=?, avatarType=? WHERE id=?";
    const selectQuery = "SELECT avatar, avatarType FROM users WHERE id = ?";

    try {
        await queryPromise(updateQuery, [avatarUrl, avatarType, authUserId]);
        const rows = await queryPromise(selectQuery, [authUserId]);
        const newAvatarUrl = rows[0].avatar;
        res.status(200).send({ message: "Avatar updated successfully", avatarUrl: newAvatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 

//Обновление данных профиля

export const updateSettings = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;
    const updateData = [req.body.name, req.body.status, authUserId];
  
    try {
        const queryString = `
            UPDATE usersData 
            SET name = ?, status = ?
            WHERE userId = ?
        `;
    
        const result = await queryPromise(queryString, updateData);
  
        res.status(201).send('Данные изменены');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


//Обновление соцсетей профиля

export const updateSocial = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;
    const updateData = [
        req.body.telegram,
        req.body.instagram,
        req.body.twitter,
        req.body.discord,
        req.body.youtube,
        req.body.tiktok,
        req.body.vk,
        req.body.link,
        authUserId
    ];
  
    try {
        const queryString = `
            INSERT INTO usersSocial 
            (telegram, instagram, twitter, discord, youtube, tiktok, vk, link, userId) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            telegram = VALUES(telegram), 
            instagram = VALUES(instagram), 
            twitter = VALUES(twitter), 
            discord = VALUES(discord), 
            youtube = VALUES(youtube), 
            tiktok = VALUES(tiktok), 
            vk = VALUES(vk), 
            link = VALUES(link)
        `
        ;
    
        const result = await queryPromise(queryString, updateData);
  
        res.status(201).send('Данные изменены');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};