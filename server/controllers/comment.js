import { db } from '../connect.js';
import { pagination } from '../shared/pagination.js';
import { userToken } from '../shared/userToken.js';
import { promisify } from 'util';

const queryPromise = promisify(db.query).bind(db);


// Получение комментариев к посту
// export const getComments = (req, res) => {
//     const postId = req.body.postId;
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;

//     try {

//         const query = `
//             SELECT
//                 comments.id,
//                 comments.text,
//                 comments.postId,
//                 comments.userId,
//                 comments.date,
//                 users.id AS replyId,
//                 ud.name,
//                 users.avatar,
//                 ud.verify,
//                 users.wallet,
//                 (SELECT COUNT(*) FROM reply WHERE commentId = comments.id) AS replyCount
//             FROM comments 
//             JOIN users ON comments.userId = users.id 
//             JOIN usersData ud ON users.id = ud.userId
//             WHERE postId = ${postId}
//             ORDER BY comments.date ASC
//         `;

//         db.query(query, (err, comments) => {
//             if (err) {throw err;}

//             const dataType = comments;
//             const page = parseInt(req.query.page);
//             const results = pagination(dataType, page);
//             res.send(results);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const getComments = async (req, res) => {
    const postId = req.body.postId;
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;

    try {
        const query = `
            SELECT
                comments.id,
                comments.text,
                comments.postId,
                comments.userId,
                comments.date,
                users.id AS replyId,
                ud.name,
                users.avatar,
                users.avatarType,
                ud.verify,
                users.wallet,
                (SELECT COUNT(*) FROM reply WHERE commentId = comments.id) AS replyCount
            FROM comments 
            JOIN users ON comments.userId = users.id 
            JOIN usersData ud ON users.id = ud.userId
            WHERE postId = ${postId}
            ORDER BY comments.date ASC
        `;

        const comments = await queryPromise(query);

        const dataType = comments;
        const page = parseInt(req.query.page);
        const limit = 5;
        const results = pagination(dataType, page, limit);
        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 

// Создание комментария
// export const createComment = (req, res) => {

//     const token = req.cookies.accessToken;
//     const authUserId = userToken(token);
//     const newComment = [
//         [req.body.text, authUserId, req.body.postId, req.body.date],
//     ];

//     try {

//         const query = `
//             INSERT INTO comments (text, userId, postId, date)
//             VALUES ?
//         `;

//         db.query(query, [newComment], (err, result) => {
//             if (err) {throw err;}

//             const queryUser = `
//             SELECT
//                 comments.id,
//                 comments.text,
//                 comments.userId,
//                 comments.postId,
//                 comments.date,
//                 ud.name,
//                 users.avatar,
//                 ud.verify,
//                 users.wallet
//             FROM comments
//             JOIN users ON comments.userId = users.id
//             JOIN usersData ud ON users.id = ud.userId
//             WHERE comments.id = ${result.insertId}
//             `;

//             db.query(queryUser, (err, result) => {
//             if (err) {throw err;}

//             res.status(201).send(result[0]);
//             });
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const createComment = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = userToken(token);
    
    //Notify


    const newComment = [
        [req.body.text, authUserId, req.body.postId, req.body.date],
    ];

    const newNotify = [
        [req.body.postId, req.body.userId, 'post', 1, req.body.date]
    ]

    try {
        const query = `
            INSERT INTO comments (text, userId, postId, date)
            VALUES ?
        `;

        const result = await queryPromise(query, [newComment]);

        const queryUser = `
            SELECT
                comments.id,
                comments.text,
                comments.userId,
                comments.postId,
                comments.date,
                ud.name,
                users.avatar,
                users.avatarType,
                ud.verify,
                users.wallet
            FROM comments
            JOIN users ON comments.userId = users.id
            JOIN usersData ud ON users.id = ud.userId
            WHERE comments.id = ${result.insertId}
        `;

        const comment = await queryPromise(queryUser);

        if (authUserId !== req.body.userId) {
            const queryNotify = `
              INSERT INTO notifications (urlId, userId, type, unread, date)
              VALUES ?
            `;
            await queryPromise(queryNotify, [newNotify]);
        }

        res.status(201).send(comment[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 

// Удаление комментария
// export const deleteComment = (req, res) => {
//     try {
//         const token = req.cookies.accessToken;
//         const authUserId = userToken(token);
//         const commentId = req.body.commentId;

//         const query = `
//             DELETE FROM comments
//             WHERE id = ${commentId}
//             AND userId = ${authUserId}
//         `;

//         db.query(query, (err, result) => {
//             if (err) {throw err;}

//             res.status(204).send(result);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const deleteComment = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = userToken(token);
    const commentId = req.body.commentId;

    try {
        const query = `
            DELETE FROM comments
            WHERE id = ${commentId}
            AND userId = ${authUserId}
        `;

        const result = await queryPromise(query);

        res.status(204).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 
