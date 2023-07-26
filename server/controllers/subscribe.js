import { db } from '../connect.js';
import { pagination } from '../shared/pagination.js';
import { userToken } from '../shared/userToken.js';
import { promisify } from 'util';

const queryPromise = promisify(db.query).bind(db);

// Получение подписчиков пользователя
// export const getFollowers = (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;
//     const userId = req.body.requestUserId;

//     try {
//         const query = `
//             SELECT 
//             users.*, 
//             ud.name,
//             COUNT(followers.followerId) AS followerCount,
//             EXISTS(
//                 SELECT 1 
//                 FROM subscribers 
//                 WHERE subscribers.followerId = ${authUserId}
//                 AND subscribers.followedId = users.id
//             ) AS followed
//             FROM subscribers 
//             JOIN users ON subscribers.followerId = users.id 
//             JOIN usersData ud ON users.id = ud.userId
//             LEFT JOIN subscribers AS followers ON followers.followedId = users.id 
//             WHERE subscribers.followedId = ${userId} 
//             GROUP BY users.id
//         `;

//         db.query(query, (err, users) => {
//             if (err) {throw err;}

//             const dataType = users;
//             const page = parseInt(req.query.page);
//             const results = pagination(dataType, page);

//             res.send(results);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const getFollowers = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;
    const userId = req.body.userId;

    try {
        const query = `
            SELECT 
            users.*, 
            ud.name,
            ud.verify,
            COUNT(followers.followerId) AS followerCount,
            EXISTS(
                SELECT 1 
                FROM subscribers 
                WHERE subscribers.followerId = ${authUserId}
                AND subscribers.followedId = users.id
            ) AS followed
            FROM subscribers 
            JOIN users ON subscribers.followerId = users.id 
            JOIN usersData ud ON users.id = ud.userId
            LEFT JOIN subscribers AS followers ON followers.followedId = users.id 
            WHERE subscribers.followedId = ${userId} 
            GROUP BY users.id
        `;


        const users = await queryPromise(query);

        const dataType = users;
        const page = parseInt(req.query.page);
        const limit = 10;
        const results = pagination(dataType, page, limit);

        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 

// Получение подписок пользователя
// export const getFollowing = (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;
//     const userId = req.body.requestUserId;

//     try {

//         const query = `
//             SELECT
//             users.*,
//             ud.name,
//             COUNT(followers.followerId) AS followerCount,
//             EXISTS(
//                 SELECT 1 
//                 FROM subscribers 
//                 WHERE subscribers.followerId = ${authUserId}
//                 AND subscribers.followedId = users.id
//             ) AS followed
//             FROM subscribers
//             JOIN users ON subscribers.followedId = users.id
//             JOIN usersData ud ON users.id = ud.userId
//             LEFT JOIN subscribers AS followers ON followers.followedId = users.id
//             WHERE subscribers.followerId = ${userId}
//             GROUP BY users.id
//         `;

//         db.query(query, (err, users) => {
//             if (err) {throw err;}

//             const dataType = users;
//             const page = parseInt(req.query.page);
//             const results = pagination(dataType, page);

//             res.send(results);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const getFollowing = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;
    const userId = req.body.userId;

    try {
        const query = `
            SELECT
            users.*,
            ud.name,
            ud.verify,
            COUNT(followers.followerId) AS followerCount,
            EXISTS(
                SELECT 1 
                FROM subscribers 
                WHERE subscribers.followerId = ${authUserId}
                AND subscribers.followedId = users.id
            ) AS followed
            FROM subscribers
            JOIN users ON subscribers.followedId = users.id
            JOIN usersData ud ON users.id = ud.userId
            LEFT JOIN subscribers AS followers ON followers.followedId = users.id
            WHERE subscribers.followerId = ${userId}
            GROUP BY users.id
        `;

        const users = await queryPromise(query);

        const dataType = users;
        const page = parseInt(req.query.page);
        const limit = 10;
        const results = pagination(dataType, page, limit);

        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 

// Подписка
// export const addFollow = (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = userToken(token);
//     const addFollow = {
//         followerId: authUserId,
//         followedId: req.body.followedId
//     };

//     try {

//         const query =`
//             INSERT INTO subscribers (followerId, followedId)
//             VALUES (?, ?)
//             ON DUPLICATE KEY UPDATE id=id
//         `;

//         db.query(query, [addFollow.followerId, addFollow.followedId], function (err, result) {
//             if (err) {throw err;}

//             res.status(201).send(result);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

// export const addFollow = async (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = userToken(token);
//     const addFollow = {
//         followerId: authUserId,
//         followedId: req.body.followedId
//     };

//     try {
//         const query =`
//             INSERT INTO subscribers (followerId, followedId)
//             VALUES (?, ?)
//             ON DUPLICATE KEY UPDATE id=id
//         `;

//         const result = await queryPromise(query, [addFollow.followerId, addFollow.followedId]);

//         res.status(201).send(result);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const addFollow = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = userToken(token);
    const followedId = req.body.userId;

    try {
        // Проверяем, есть ли уже запись в таблице blocked для данного пользователя
        const blockedQuery = `
            SELECT blockedCount
            FROM blocked
            WHERE blockedId = ?
        `;
        const blockedResult = await queryPromise(blockedQuery, [authUserId]);

        if (blockedResult.length > 0 && blockedResult[0].blockedCount >= 30) {
            return res.status(400).send({ message: 'Вы превысили лимит' });
        }

        // Добавляем/обновляем запись в таблице subscribers
        const followQuery =`
            INSERT INTO subscribers (followerId, followedId)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE id=id
        `;
        const followResult = await queryPromise(followQuery, [authUserId, followedId]);

        // Обновляем или добавляем запись в таблице blocked
        const updateBlockedQuery = `
            INSERT INTO blocked (blockedId, blockedCount)
            VALUES (?, 1)
            ON DUPLICATE KEY UPDATE blockedCount = blockedCount + 1
        `;
        await queryPromise(updateBlockedQuery, [authUserId]);

        res.status(201).send('Вы подписались');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Отмена подписки
// export const deleteFollow = (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = userToken(token);
//     const deleteFollow = {
//         followerId: authUserId,
//         followedId: req.body.followedId
//     };

//     try {

//         const query = `
//             DELETE FROM subscribers
//             WHERE followerId=? AND followedId=?
//         `;

//         db.query(query, [deleteFollow.followerId, deleteFollow.followedId], function (err, result) {
//             if (err) {throw err;}
            
//             res.status(200).send(result);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const deleteFollow = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = userToken(token);
    const followedId = req.body.userId;

    try {
        const query = `
            DELETE FROM subscribers
            WHERE followerId=? AND followedId=?
        `;

        const result = await queryPromise(query, [authUserId, followedId]);

        res.status(201).send('Вы отписались');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 