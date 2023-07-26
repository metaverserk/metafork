import { db } from '../connect.js';
import { userToken } from '../shared/userToken.js';
import { promisify } from 'util';
const queryPromise = promisify(db.query).bind(db);

// Лайк поста
// export const addLike = (req, res) => {
//     try {
//         const token = req.cookies.accessToken;
//         const authUserId = userToken(token);
//         const like = {
//             userId: authUserId,
//             postId: req.body.likePostId
//         };

//         const query = "INSERT INTO likes (userId, postId) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id";

//         db.query(query, [like.userId, like.postId], (err, result) => {
//             if (err) {
//             throw err;
//             }
//             res.status(201).send(result);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

// export const addLike = async (req, res) => {
//     try {
//       const token = req.cookies.accessToken;
//       const authUserId = userToken(token);
//       const like = {
//         userId: authUserId,
//         postId: req.body.likePostId,
//       };
  
//       const query =
//         "INSERT INTO likes (userId, postId) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id";
  
//       db.query(query, [like.userId, like.postId], (err, result) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send("Server Error");
//         } else {
//           res.status(201).send(result);
//         }
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Server Error");
//     }
// };

export const addLike = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const authUserId = userToken(token);
        const likePostId = req.body.postId;

        const query =
            "INSERT INTO likes (userId, postId) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id";

        await queryPromise(query, [authUserId, likePostId]);
        res.status(201).send("Like added successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}; 

// Удаление лайка с поста
// export const deleteLike = (req, res) => {
//     try {
//         const token = req.cookies.accessToken;
//         const authUserId = userToken(token);
//         const like = {
//             userId: authUserId,
//             likePostId: req.body.likePostId
//         };

//         const query = "DELETE FROM likes WHERE userId=? AND postId=?";

//         db.query(query, [like.userId, like.likePostId], (err, result) => {
//             if (err) {
//             throw err;
//             }
//             res.status(201).send(result);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

// export const deleteLike = async (req, res) => {
//     try {
//       const token = req.cookies.accessToken;
//       const authUserId = userToken(token);
//       const like = {
//         userId: authUserId,
//         postId: req.body.likePostId,
//       };
  
//       const query = "DELETE FROM likes WHERE userId=? AND postId=?";
  
//       db.query(query, [like.userId, like.postId], (err, result) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send("Server Error");
//         } else {
//           res.status(201).send(result);
//         }
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Server Error");
//     }
// };

export const deleteLike = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const authUserId = userToken(token);
        const likePostId = req.body.postId;

        const query = "DELETE FROM likes WHERE userId=? AND postId=?";

        await queryPromise(query, [authUserId, likePostId]);
        res.status(201).send("Like deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}; 