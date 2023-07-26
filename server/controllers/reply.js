import { db } from '../connect.js';
import { pagination } from '../shared/pagination.js';
import { userToken } from '../shared/userToken.js';
import { promisify } from 'util';

const queryPromise = promisify(db.query).bind(db);

// Получение ответов к комментарию
// export const getReply = (req, res) => {
//     const commentId = req.body.commentId;

//     try {

//         const query = `
//         SELECT
//             reply.id,
//             reply.text,
//             reply.commentId,
//             reply.userId,
//             reply.date,
//             reply.replyId,
//             ud.name AS replyName,
//             reply_user.wallet AS replyWallet,
//             ud.name,
//             users.avatar,
//             ud.verify,
//             users.wallet
//         FROM reply
//         JOIN users ON reply.userId = users.id 
//         JOIN usersData ud ON users.id = ud.userId
//         JOIN users AS reply_user ON reply.replyId = reply_user.id
//         WHERE commentId = ${commentId}
//         ORDER BY date ASC`; 

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
  
export const getReply = async (req, res) => {
    const commentId = req.body.commentId;
  
    try {
      const queryString = `
        SELECT
          reply.id,
          reply.text,
          reply.commentId,
          reply.userId,
          reply.date,
          reply.replyUserId,
          reply.replyCommentId,
          reply_ud.name AS replyName,
          reply_user.wallet AS replyWallet,
          ud.name,
          users.avatar,
          users.avatarType,
          ud.verify,
          users.wallet
        FROM reply
        JOIN users ON reply.userId = users.id 
        JOIN usersData ud ON users.id = ud.userId
        JOIN usersData AS reply_ud ON reply.replyUserId = reply_ud.userId
        JOIN users AS reply_user ON reply.replyUserId = reply_user.id
        WHERE commentId = ?
        ORDER BY date ASC`;
  
      const comments = await queryPromise(queryString, [commentId]);
  
      const dataType = comments;
      const page = parseInt(req.query.page);
      const limit = 10;
      const results = pagination(dataType, page, limit);
  
      res.send(results);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
};

// Создание ответа
// export const createReply = (req, res) => {

//     const token = req.cookies.accessToken;
//     const authUserId = userToken(token);
//     const newReply = [
//         [req.body.text, authUserId, req.body.postId, req.body.date, req.body.commentId, req.body.replyId],
//     ];

//     try {

//         const query = `
//             INSERT INTO reply (text, userId, postId, date, commentId, replyId)
//             VALUES ?
//         `;

//         db.query(query, [newReply], (err, result) => {
//             if (err) {throw err;}

//             const queryUser = `
//             SELECT
//                 reply.id,
//                 reply.text,
//                 reply.userId,
//                 reply.postId,
//                 reply.date,
//                 reply.commentId,
//                 reply.replyId,
//                 ud_reply.name AS replyName,
//                 users.wallet AS replyWallet,
//                 ud.name,
//                 users.avatar,
//                 ud.verify,
//                 users.wallet
//             FROM reply
//             JOIN users ON reply.userId = users.id
//             JOIN usersData ud ON users.id = ud.userId
//             JOIN usersData ud_reply ON reply.replyId = ud_reply.userId
//             WHERE reply.id = ${result.insertId}
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

export const createReply = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const authUserId = userToken(token);
        const newReply = [
            [req.body.text, authUserId, req.body.postId, req.body.date, req.body.commentId, req.body.replyUserId, req.body.replyCommentId],
        ];

        const newNotify = [
          [req.body.postId, req.body.replyUserId, 'comment', 1, req.body.date]
        ]

        const query = `
            INSERT INTO reply (text, userId, postId, date, commentId, replyUserId, replyCommentId)
            VALUES ?
        `;

        const result = await queryPromise(query, [newReply]);


        const queryUser = `
        SELECT
          reply.id,
          reply.text,
          reply.commentId,
          reply.userId,
          reply.date,
          reply.replyUserId,
          reply.replyCommentId,
          reply_ud.name AS replyName,
          reply_user.wallet AS replyWallet,
          ud.name,
          users.avatar,
          users.avatarType,
          ud.verify,
          users.wallet
        FROM reply
        JOIN users ON reply.userId = users.id 
        JOIN usersData ud ON users.id = ud.userId
        JOIN usersData AS reply_ud ON reply.replyUserId = reply_ud.userId
        JOIN users AS reply_user ON reply.replyUserId = reply_user.id
        WHERE reply.id = ${result.insertId}`;
   
        // const queryUser = `
        //     SELECT
        //         reply.id,
        //         reply.text,
        //         reply.userId,
        //         reply.postId,
        //         reply.date,
        //         reply.commentId,
        //         reply.userId,
        //         reply.replyCommentId,
        //         ud_reply.name AS replyName,
        //         users.wallet AS replyWallet,
        //         ud.name,
        //         users.avatar,
        //         ud.verify,
        //         users.wallet
        //     FROM reply
        //     JOIN users ON reply.userId = users.id
        //     JOIN usersData ud ON users.id = ud.userId
        //     JOIN usersData ud_reply ON reply.userId = ud_reply.userId
        //     WHERE reply.id = ${result.insertId}
        // `;

        const replyResult = await promisify(db.query).bind(db)(queryUser);

        if (authUserId !== req.body.replyUserId) {
          const queryNotify = `
            INSERT INTO notifications (urlId, userId, type, unread, date)
            VALUES ?
          `;
          await queryPromise(queryNotify, [newNotify]);
      }

        res.status(201).send(replyResult[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 

// Удаление ответа
// export const deleteReply = (req, res) => {
//     try {
//         const token = req.cookies.accessToken;
//         const authUserId = userToken(token);
//         const replyId = req.body.replyId;

//         const query = `
//             DELETE FROM reply
//             WHERE id = ${replyId}
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

export const deleteReply = async (req, res) => {
    try {
      const token = req.cookies.accessToken;
      const authUserId = userToken(token);
      const replyId = req.body.replyId;
  
      const query = `
        DELETE FROM reply
        WHERE id = ${replyId}
        AND userId = ${authUserId}
      `;
  
      const result = await queryPromise(query);
  
      res.status(204).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
};