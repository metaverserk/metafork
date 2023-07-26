import { db } from '../connect.js';
import { pagination } from '../shared/pagination.js';
import { userToken } from '../shared/userToken.js';
import { promisify } from 'util';

const queryPromise = promisify(db.query).bind(db);

// Получение списка постов от подписок
// export const getPosts = (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;

//     try {
    
//         const query = `
//             SELECT 
//                 posts.id, 
//                 posts.userId, 
//                 posts.text, 
//                 posts.date, 
//                 posts.image, 
//                 ud.name, 
//                 users.avatar, 
//                 ud.verify, 
//                 users.wallet, 
//                 COUNT(DISTINCT likes.userId) AS likes, 
//                 COUNT(DISTINCT comments.id) + COUNT(DISTINCT reply.id) AS comments,
//                 EXISTS(
//                 SELECT *
//                 FROM likes
//                 WHERE likes.postId = posts.id
//                 AND likes.userId = ${authUserId}
//                 ) AS \`like\`
//             FROM posts 
//             JOIN usersData ud ON posts.userId = ud.userId
//             JOIN users ON posts.userId = users.id 
//             LEFT JOIN likes ON likes.postId = posts.id 
//             LEFT JOIN comments ON comments.postId = posts.id
//             LEFT JOIN reply ON reply.postId = posts.id 
//             GROUP BY posts.id DESC
//             ORDER BY likes DESC
//         `;
    

//         console.log(typeof query)
//         db.query(query, (err, posts) => {
//             if (err) {throw err;}
        
//             const dataType = posts;
//             const page = parseInt(req.query.page);
//             const results = pagination(dataType, page);
        
//             res.send(results);
//             console.log(results)
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const getPosts = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;


    try {

        let queryString = `
        SELECT 
            posts.id, 
            posts.userId, 
            posts.text, 
            posts.date, 
            postData.file AS file,
            postData.fileType AS fileType,
            ud.name, 
            users.avatar, 
            users.avatarType,
            ud.verify, 
            users.wallet, 
            COUNT(DISTINCT likes.userId) AS likes, 
            COUNT(DISTINCT comments.id) + COUNT(DISTINCT reply.id) AS comments,
            EXISTS(
              SELECT *
              FROM likes
              WHERE likes.postId = posts.id
              AND likes.userId = ${authUserId}
            ) AS \`like\`
        FROM posts 
        JOIN usersData ud ON posts.userId = ud.userId
        JOIN users ON posts.userId = users.id 
        LEFT JOIN likes ON likes.postId = posts.id 
        LEFT JOIN comments ON comments.postId = posts.id
        LEFT JOIN reply ON reply.postId = posts.id 
        JOIN subscribers ON subscribers.followedId = posts.userId
        LEFT JOIN postData ON postData.postId = posts.id  
        WHERE subscribers.followerId = ${authUserId}
        GROUP BY posts.id DESC
        ORDER BY posts.date DESC
        `;

    
        const posts = await queryPromise(queryString);
    
        const dataType = posts;
        const page = parseInt(req.query.page);
        const limit = 10;
        const results = pagination(dataType, page, limit);
    
        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 

// Получение списка всех постов
export const getAllPosts = async (req, res) => {
  const token = req.cookies.accessToken;
  const authUserId = token ? userToken(token) : null;
  const type = req.body.type;

  try {

      let queryString = `
      SELECT 
          posts.id, 
          posts.userId, 
          posts.text, 
          posts.date, 
          postData.file AS file,
          postData.fileType AS fileType,
          ud.name, 
          users.avatar, 
          users.avatarType,
          ud.verify, 
          users.wallet, 
          COUNT(DISTINCT likes.userId) AS likes, 
          COUNT(DISTINCT comments.id) + COUNT(DISTINCT reply.id) AS comments,
          EXISTS(
          SELECT *
          FROM likes
          WHERE likes.postId = posts.id
          AND likes.userId = ${authUserId}
          ) AS \`like\`
      FROM posts 
      JOIN usersData ud ON posts.userId = ud.userId
      JOIN users ON posts.userId = users.id 
      LEFT JOIN likes ON likes.postId = posts.id 
      LEFT JOIN comments ON comments.postId = posts.id
      LEFT JOIN reply ON reply.postId = posts.id 
      LEFT JOIN postData ON postData.postId = posts.id  
      GROUP BY posts.id DESC
  
      `;

      if (type !== 'popular' && type !== 'new') {
        queryString += ` ORDER BY posts.date DESC`;
      } else if (type === 'popular') {
        queryString += ` ORDER BY likes DESC`;
      } else if (type === 'new') {
        queryString += ` ORDER BY posts.date DESC`;
      }
  
      const posts = await queryPromise(queryString);
  
      const dataType = posts;
      const page = parseInt(req.query.page);
      const limit = 10;
      const results = pagination(dataType, page, limit);
  
      res.send(results);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
}; 

// Получение списка постов от подписок
// export const getPosts = (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;

//     try {
    
//         const query = `
//             SELECT 
//                 posts.id, 
//                 posts.userId, 
//                 posts.text, 
//                 posts.date, 
//                 posts.image, 
//                 ud.name, 
//                 users.avatar, 
//                 ud.verify, 
//                 users.wallet, 
//                 COUNT(DISTINCT likes.userId) AS likes, 
//                 COUNT(DISTINCT comments.id) + COUNT(DISTINCT reply.id) AS comments,
//                 EXISTS(
//                 SELECT *
//                 FROM likes
//                 WHERE likes.postId = posts.id
//                 AND likes.userId = ${authUserId}
//                 ) AS \`like\`
//             FROM posts 
//             JOIN usersData ud ON posts.userId = ud.userId
//             JOIN users ON posts.userId = users.id 
//             LEFT JOIN likes ON likes.postId = posts.id 
//             LEFT JOIN comments ON comments.postId = posts.id
//             LEFT JOIN reply ON reply.postId = posts.id 
//             GROUP BY posts.id DESC
//             ORDER BY likes DESC
//         `;
    

//         console.log(typeof query)
//         db.query(query, (err, posts) => {
//             if (err) {throw err;}
        
//             const dataType = posts;
//             const page = parseInt(req.query.page);
//             const results = pagination(dataType, page);
        
//             res.send(results);
//             console.log(results)
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const getSearchPosts = async (req, res) => {
  const token = req.cookies.accessToken;
  const search = req.body.query;
  const authUserId = token ? userToken(token) : null;

  console.log(search)

  try {

    let queryString = `
      SELECT 
          posts.id, 
          posts.userId, 
          posts.text, 
          posts.date, 
          postData.file AS file,
          postData.fileType AS fileType,
          ud.name, 
          users.avatar, 
          users.avatarType,
          ud.verify, 
          users.wallet, 
          COUNT(DISTINCT likes.userId) AS likes, 
          COUNT(DISTINCT comments.id) + COUNT(DISTINCT reply.id) AS comments,
          EXISTS(
          SELECT *
          FROM likes
          WHERE likes.postId = posts.id
          AND likes.userId = ${authUserId}
          ) AS \`like\`
      FROM posts 
      JOIN usersData ud ON posts.userId = ud.userId
      JOIN users ON posts.userId = users.id 
      LEFT JOIN likes ON likes.postId = posts.id 
      LEFT JOIN comments ON comments.postId = posts.id
      LEFT JOIN reply ON reply.postId = posts.id 
      LEFT JOIN postData ON postData.postId = posts.id  
      WHERE posts.text LIKE '%${search}%'
      GROUP BY posts.id DESC
      ORDER BY posts.date DESC
      `;

  
      const posts = await queryPromise(queryString);
  
      const dataType = posts;
      const page = parseInt(req.query.page);
      const limit = 10;
      const results = pagination(dataType, page, limit);
  
      res.send(results);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
}; 
  
// Получение списка постов пользователя
// export const getUserPosts = (req, res) => {
//     const userId = req.body.requestUserId;
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;

//     try {
    
//         const query = `
//             SELECT 
//                 posts.id, 
//                 posts.userId, 
//                 posts.text, 
//                 posts.date, 
//                 posts.image, 
//                 ud.name, 
//                 users.avatar, 
//                 ud.verify, 
//                 users.wallet, 
//                 COUNT(DISTINCT likes.userId) AS likes, 
//                 COUNT(DISTINCT comments.id) + COUNT(DISTINCT reply.id) AS comments, 
//                 EXISTS(
//                 SELECT *
//                 FROM likes
//                 WHERE likes.postId = posts.id
//                 AND likes.userId = ${authUserId}
//                 ) AS \`like\`
//             FROM posts 
//             JOIN usersData ud ON posts.userId = ud.userId
//             JOIN users ON posts.userId = users.id 
//             LEFT JOIN likes ON likes.postId = posts.id 
//             LEFT JOIN comments ON comments.postId = posts.id 
//             LEFT JOIN reply ON reply.postId = posts.id 
//             WHERE posts.userId = ${userId} 
//             GROUP BY posts.id DESC
//         `;
    
//         db.query(query, (err, posts) => {
//             if (err) {throw err;}
        
//             const dataType = posts;
//             const page = parseInt(req.query.page);
//             const results = pagination(dataType, page);
        
//             res.send(results);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

export const getUserPosts = async (req, res) => {
    const userId = req.body.userId;
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;
  
    try {
      const queryString = `
        SELECT 
          posts.id, 
          posts.userId, 
          posts.text, 
          posts.date, 
          postData.file AS file, 
          postData.fileType AS fileType,
          ud.name, 
          users.avatar, 
          users.avatarType, 
          ud.verify, 
          users.wallet, 
          COUNT(DISTINCT likes.userId) AS likes, 
          COUNT(DISTINCT comments.id) + COUNT(DISTINCT reply.id) AS comments, 
          EXISTS(
            SELECT *
            FROM likes
            WHERE likes.postId = posts.id
            AND likes.userId = ${authUserId}
          ) AS \`like\`
        FROM posts 
        JOIN usersData ud ON posts.userId = ud.userId
        JOIN users ON posts.userId = users.id 
        LEFT JOIN likes ON likes.postId = posts.id 
        LEFT JOIN comments ON comments.postId = posts.id 
        LEFT JOIN reply ON reply.postId = posts.id 
        LEFT JOIN postData ON postData.postId = posts.id
        WHERE posts.userId = ${userId} 
        GROUP BY posts.id DESC
      `;
    
      const posts = await queryPromise(queryString);
    
      const dataType = posts;
      const page = parseInt(req.query.page);
      const limit = 10;
      const results = pagination(dataType, page, limit);
    
      res.send(results);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
};
  
// Получаем данные об одном посте
// export const getPost = (req, res) => {
//     const postId = req.body.postId;
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;


//     try {
    
//         const query = `
//             SELECT 
//                 posts.id, 
//                 posts.userId, 
//                 posts.text, 
//                 posts.date, 
//                 posts.image, 
//                 ud.name, 
//                 users.avatar, 
//                 ud.verify, 
//                 users.wallet, 
//                 COUNT(DISTINCT likes.userId) AS likes, 
//                 COUNT(DISTINCT comments.id) AS comments, 
//                 EXISTS(
//                 SELECT *
//                 FROM likes
//                 WHERE likes.postId = posts.id
//                 AND likes.userId = ${authUserId}
//                 ) AS \`like\`
//             FROM posts
//             JOIN users ON posts.userId = users.id
//             JOIN usersData ud ON posts.userId = ud.userId
//             LEFT JOIN likes ON likes.postId = posts.id
//             LEFT JOIN comments ON comments.postId = posts.id
//             WHERE posts.id = ${postId}
//             GROUP BY posts.id DESC`;
    
//         db.query(query, (err, result) => {
//             if (err) {throw err;}
        
//             if (result.length === 0) {
//                 return res.status(404).send({ message: 'Пост не найден' });
//             }
        
//             res.send(result[0]);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

// export const getPost = async (req, res) => {
//     const postId = req.body.postId;
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;
  
//     try {
//       const queryString = `
//         SELECT 
//           posts.id, 
//           posts.userId, 
//           posts.text, 
//           posts.date, 
//           posts.image, 
//           ud.name, 
//           users.avatar, 
//           ud.verify, 
//           users.wallet, 
//           COUNT(DISTINCT likes.userId) AS likes, 
//           COUNT(DISTINCT comments.id) AS comments, 
//           EXISTS(
//             SELECT *
//             FROM likes
//             WHERE likes.postId = posts.id
//             AND likes.userId = ${authUserId}
//           ) AS \`like\`
//         FROM posts
//         JOIN users ON posts.userId = users.id
//         JOIN usersData ud ON posts.userId = ud.userId
//         LEFT JOIN likes ON likes.postId = posts.id
//         LEFT JOIN comments ON comments.postId = posts.id
//         WHERE posts.id = ${postId}
//         GROUP BY posts.id DESC`;
  
//       const result = await queryPromise(queryString);
  
//       if (result.length === 0) {
//         return res.status(404).send({ message: 'Пост не найден' });
//       }
  
//       res.send(result[0]);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server Error');
//     }
// };

export const getPost = async (req, res) => {
  const postId = req.body.postId;
  const token = req.cookies.accessToken;
  const authUserId = token ? userToken(token) : null;

  try {
    const queryString = `
      SELECT 
        posts.id, 
        posts.userId, 
        posts.text, 
        posts.date, 
        postData.file AS file,
        postData.fileType AS fileType,
        ud.name, 
        users.avatar,
        users.avatarType, 
        ud.verify, 
        users.wallet, 
        COUNT(DISTINCT likes.userId) AS likes, 
        COUNT(DISTINCT comments.id) AS comments, 
        EXISTS(
          SELECT *
          FROM likes
          WHERE likes.postId = posts.id
          AND likes.userId = ${authUserId}
        ) AS \`like\`
      FROM posts
      JOIN users ON posts.userId = users.id
      JOIN usersData ud ON posts.userId = ud.userId
      LEFT JOIN likes ON likes.postId = posts.id
      LEFT JOIN comments ON comments.postId = posts.id
      LEFT JOIN postData ON postData.postId = posts.id  
      WHERE posts.id = ${postId}
      GROUP BY posts.id DESC`;

    const result = await queryPromise(queryString);

    if (result.length === 0) {
      return res.status(404).send({ message: 'Пост не найден' });
    }

    res.send(result[0]);
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
      res.status(404).send({ message: 'Пост не найден' });
    } else {
      res.status(500).send('Server Error');
    }
  }
};

// Удаление поста
// export const deletePost = (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;
//     const postId = req.body.postId;

//     try {
//         const query = `
//             DELETE FROM posts
//             WHERE id = ${postId}
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

export const deletePost = async (req, res) => {
    const postId = req.body.postId;
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;
  
    try {
      const queryString = `
        DELETE FROM posts
        WHERE id = ${postId}
        AND userId = ${authUserId}
      `;
  
      const result = await queryPromise(queryString);
  
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Пост не найден или вы не являетесь его автором' });
      }
  
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
};
  
// Создание поста
// export const createPost = (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = userToken(token);
//     const newPost = [[req.body.text, req.body.date, authUserId, req.body.image]];

//     try {
    
//         const query = `
//             INSERT INTO posts (text, date, userId, image)
//             VALUES ?
//         `;
        
//         db.query(query, [newPost], (err, result) => {
//             if (err) {throw err;}
//             const queryUser = `
//                 SELECT 
//                     posts.id, 
//                     posts.userId, 
//                     posts.text, 
//                     posts.date,
//                     posts.image, 
//                     ud.name, 
//                     users.avatar, 
//                     ud.verify, 
//                     users.wallet, 
//                     COUNT(likes.postId) AS likes, 
//                     COUNT(comments.postId) AS comments 
//                 FROM posts 
//                 JOIN usersData ud ON posts.userId = ud.userId
//                 JOIN users ON posts.userId = users.id 
//                 LEFT JOIN likes ON likes.postId = ${result.insertId} 
//                 LEFT JOIN comments ON comments.postId = ${result.insertId}  
//                 WHERE posts.id = ${result.insertId}
//             `;
    
//             db.query(queryUser, (err, result) => {
//                 if (err) {
//                     throw err;
//                 }
//                 res.status(201).send(result[0]);
//             });
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

// export const createPost = async (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;
//     const newPost = [[req.body.text, req.body.date, authUserId, req.body.file]];
  
//     try {
//       const queryString = `
//         INSERT INTO posts (text, date, userId, image)
//         VALUES ?
//       `;
  
//       const result = await queryPromise(queryString, [newPost]);
  
//       const queryUser = `
//         SELECT 
//           posts.id, 
//           posts.userId, 
//           posts.text, 
//           posts.date,
//           posts.image, 
//           ud.name, 
//           users.avatar, 
//           ud.verify, 
//           users.wallet, 
//           COUNT(likes.postId) AS likes, 
//           COUNT(comments.postId) AS comments 
//         FROM posts 
//         JOIN usersData ud ON posts.userId = ud.userId
//         JOIN users ON posts.userId = users.id 
//         LEFT JOIN likes ON likes.postId = ${result.insertId} 
//         LEFT JOIN comments ON comments.postId = ${result.insertId}  
//         WHERE posts.id = ${result.insertId}
//       `;
  
//       const postResult = await queryPromise(queryUser);
  
//       res.status(201).send(postResult[0]);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server Error');
//     }
// };


export const createPost = async (req, res) => {
  const token = req.cookies.accessToken;
  const authUserId = token ? userToken(token) : null;
  const newPost = [[req.body.text, req.body.date, authUserId]];

  try {
    const queryString = `
      INSERT INTO posts (text, date, userId)
      VALUES ?
    `;

    const result = await queryPromise(queryString, [newPost]);

    const postId = result.insertId;

    const postData = [[postId, req.body.file, req.body.fileType]];

    const queryPostData = `
      INSERT INTO postData (postId, file, fileType)
      VALUES ?
    `;

    await queryPromise(queryPostData, [postData]);

    const queryUser = `
      SELECT 
        posts.id, 
        posts.userId, 
        posts.text, 
        posts.date,
        postData.file AS file,
        postData.fileType AS fileType,
        ud.name, 
        users.avatar, 
        users.avatarType,
        ud.verify, 
        users.wallet, 
        COUNT(likes.postId) AS likes, 
        COUNT(comments.postId) AS comments 
      FROM posts 
      JOIN usersData ud ON posts.userId = ud.userId
      JOIN users ON posts.userId = users.id 
      LEFT JOIN likes ON likes.postId = ${postId} 
      LEFT JOIN comments ON comments.postId = ${postId}  
      LEFT JOIN postData ON postData.postId = ${postId}  
      WHERE posts.id = ${postId}
    `;

    const postResult = await queryPromise(queryUser);

    res.status(201).send(postResult[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


// Редактирование поста
export const editPost = async (req, res) => {
  const token = req.cookies.accessToken;
  const authUserId = token ? userToken(token) : null;
  const editPostId = req.body.editPostData.id;
  const editPostText = req.body.editPostData.text;

  try {
    const queryString = `
      UPDATE posts
      SET text = ?
      WHERE id = ? AND userId = ?
    `;

    const result = await queryPromise(queryString, [editPostText, editPostId, authUserId]);

    res.status(201).send('Публикация изменена');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};