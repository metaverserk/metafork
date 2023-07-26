import { db } from '../connect.js';
import { userToken } from '../shared/userToken.js';
import { pagination } from '../shared/pagination.js';
import { promisify } from 'util';

const queryPromise = promisify(db.query).bind(db);


    

// Получение списка всех диалогов
export const getUserDialogs = async (req, res) => {
    try {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;

    const queryParams = Array(17).fill(authUserId);

    const queryString = `
      SELECT 
          dialogs.id AS id, 
          CASE
              WHEN user1.id = ? THEN user2.id
              ELSE user1.id
          END AS userId,
          CASE
              WHEN user1.id = ? THEN user2.wallet
              ELSE user1.wallet
          END AS userWallet,
          CASE
              WHEN user1.id = ? THEN user2Data.name
              ELSE user1Data.name
          END AS userName,
          CASE
              WHEN user1.id = ? THEN user2Data.verify
              ELSE user1Data.verify
          END AS userVerify,
          CASE
              WHEN user1.id = ? THEN user2.avatar
              ELSE user1.avatar
          END AS userAvatar,
          CASE
              WHEN user1.id = ? THEN user2.avatarType
              ELSE user1.avatarType
          END AS userAvatarType,
          dialogs.lastMessage AS lastMessage, 
          dialogs.lastDate AS lastDate,
          (SELECT COUNT(*) FROM messages WHERE roomId = dialogs.id AND receiverId = ? AND unread = true) AS unreadMessages
      FROM dialogs
      JOIN users AS user1 ON dialogs.userFirst = user1.id
      JOIN usersData AS user1Data ON user1.id = user1Data.userId
      JOIN users AS user2 ON dialogs.userLast = user2.id
      JOIN usersData AS user2Data ON user2.id = user2Data.userId
      WHERE ((dialogs.userFirst = ? AND dialogs.userLast <> ?) OR (dialogs.userLast = ? AND dialogs.userFirst <> ?))
      AND (dialogs.userFirst = ? OR dialogs.userLast = ? OR dialogs.userFirst = ? OR dialogs.userLast = ?)
      ORDER BY lastDate DESC
  `;

const dialogs = await queryPromise(queryString, [...queryParams]); 
      const dataType = dialogs;
      const page = parseInt(req.query.page);
      const limit = 10;
      const results = pagination(dataType, page, limit);

      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
};


// Получение информации о собеседнике
export const getDialogUserData = async (req, res) => {
  try {
  const token = req.cookies.accessToken;
  const authUserId = token ? userToken(token) : null;

  const dialogUserId = req.body.dialogUserId;


  const query = `
    SELECT users.wallet, usersData.name
    FROM users
    JOIN usersData ON users.id = usersData.userId
    WHERE users.id = ?
  `;

  const result = await queryPromise(query, [dialogUserId]); 

    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};





// export const getMessages = async (req, res) => {
//   try {
//     const token = req.cookies.accessToken;
//     const authUserId = token ? userToken(token) : null;

//     const dialogUserId = req.body.dialogUserId;

//     // Check if dialogUserId exists in the users table
//     const queryUser = `
//       SELECT id
//       FROM users
//       WHERE id = ?
//     `;
//     const valuesUser = [dialogUserId];
//     const resultUser = await queryPromise(queryUser, valuesUser);

//     if (resultUser.length === 0) {
//       res.status(404).send('User not found');
//       return;
//     }

//     // Find the dialog between the two users
//     const queryDialog = `
//       SELECT id AS roomId, lastDate
//       FROM dialogs
//       WHERE (userFirst = ? AND userLast = ?) OR (userFirst = ? AND userLast = ?)
//     `;
//     const valuesDialog = [authUserId, dialogUserId, dialogUserId, authUserId];
//     const resultDialog = await queryPromise(queryDialog, valuesDialog);

//     let roomId;
//     let lastDate;
//     if (resultDialog.length > 0) {
//       roomId = resultDialog[0].roomId;
//       lastDate = resultDialog[0].lastDate;
//     }

//     const queryParams = [authUserId, dialogUserId, dialogUserId, authUserId];
//     const queryString = `
//       SELECT
//         *
//       FROM messages 
//       WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
//       ORDER BY messages.date DESC
//     `;

//     const dialogs = await queryPromise(queryString, [...queryParams]);

//     const dataType = dialogs;
//     const page = parseInt(req.query.page);
//     const limit = 20;
//     const results = pagination(dataType, page, limit);

//     // Add roomId and lastDate to the response object
//     if (roomId) {
//       results.roomId = roomId;
//       results.lastDate = lastDate;
//     }

//     res.json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal server error');
//   }
// };


export const getMessages = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;

    const dialogUserId = req.body.dialogUserId;

    // Check if dialogUserId exists in the users table
    const queryUser = `
      SELECT id
      FROM users
      WHERE id = ?
    `;
    const valuesUser = [dialogUserId];
    const resultUser = await queryPromise(queryUser, valuesUser);

    if (resultUser.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    // Find the dialog between the two users
    const queryDialog = `
      SELECT id AS roomId
      FROM dialogs
      WHERE (userFirst = ? AND userLast = ?) OR (userFirst = ? AND userLast = ?)
    `;
    const valuesDialog = [authUserId, dialogUserId, dialogUserId, authUserId];
    const resultDialog = await queryPromise(queryDialog, valuesDialog);

    let roomId;

    if (resultDialog.length > 0) {
      roomId = resultDialog[0].roomId;

    }

    const queryParams = [authUserId, dialogUserId, dialogUserId, authUserId];
    const queryString = `
      SELECT
        *
      FROM messages 
      WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
      ORDER BY messages.date DESC
    `;

    const dialogs = await queryPromise(queryString, [...queryParams]);

    const dataType = dialogs;
    const page = parseInt(req.query.page);
    const limit = 20;
    const results = pagination(dataType, page, limit);

    // Add roomId and lastDate to the response object
    if (roomId) {
      results.roomId = roomId;
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};





// Создание с


// // Создание сообщения
// export const createMessage = async (req, res) => {
//     const token = req.cookies.accessToken;
//     const authUserId = userToken(token);
//     const newMessageData = [
//         [req.body.text, authUserId, req.body.receiverId, req.body.date],
//     ];

//     try {
//         const query = `
//             INSERT INTO messages (text, senderId, receiverId, date)
//             VALUES ?
//         `;

//         const result = await queryPromise(query, [newMessageData]);

//         const queryUser = `
//             SELECT
//                 messages.id,
//                 messages.text,
//                 messages.senderId,
//                 messages.receiverId,
//                 messages.date
//             FROM messages
//             WHERE messages.id = ${result.insertId}
//         `;

//         const message = await queryPromise(queryUser);
//         res.status(201).send(message[0]);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// }; 





// Создание сообщения и диалога
export const createMessage = async (req, res) => {
  const token = req.cookies.accessToken;
  const authUserId = userToken(token);
  const receiverId = req.body.receiverId;
  const text = req.body.text;
  const date = req.body.date;
  const unread = true;

  try {
      // Проверяем, существует ли уже диалоговое окно между двумя пользователями
      const queryDialog = `
          SELECT id AS roomId
          FROM dialogs
          WHERE (userFirst = ? AND userLast = ?) OR (userFirst = ? AND userLast = ?)
      `;
      const valuesDialog = [authUserId, receiverId, receiverId, authUserId];
      const resultDialog = await queryPromise(queryDialog, valuesDialog);

      let roomId;
      if (resultDialog.length === 0) {
          // Если диалоговое окно не существует, создаем новое и получаем его идентификатор
          const queryNewDialog = `
              INSERT INTO dialogs (userFirst, userLast, lastMessage, lastDate)
              VALUES (?, ?, ?, ?)
          `;
          const valuesNewDialog = [authUserId, receiverId, text, date];
          const resultNewDialog = await queryPromise(queryNewDialog, valuesNewDialog);
          roomId = resultNewDialog.insertId;
      } else {
          // Если диалоговое окно уже существует, получаем его идентификатор
          roomId = resultDialog[0].roomId;
          // Обновляем последнее сообщение в существующем диалоговом окне
          const queryUpdateDialog = `
              UPDATE dialogs
              SET lastMessage = ?, lastDate = ?
              WHERE id = ?
          `;
          const valuesUpdateDialog = [text, date, roomId];
          await queryPromise(queryUpdateDialog, valuesUpdateDialog);
      }

      // Создаем сообщение с идентификатором комнаты и датой
      const queryMessage = `
          INSERT INTO messages (text, senderId, receiverId, date, unread, roomId)
          VALUES (?, ?, ?, ?, ?, ?)
      `;
      const valuesMessage = [text, authUserId, receiverId, date, unread, roomId];
      const resultMessage = await queryPromise(queryMessage, valuesMessage);

      // Получаем созданное сообщение
      const queryUser = `
          SELECT
              messages.id,
              messages.text,
              messages.senderId,
              messages.receiverId,
              messages.date,
              messages.roomId,
              messages.unread
          FROM messages
          WHERE messages.id = ${resultMessage.insertId}
      `;
      const message = await queryPromise(queryUser);

      res.status(201).send(message[0]);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
};


export const readMessage = async (req, res) => {
  try {
      const token = req.cookies.accessToken;
      const authUserId = token ? userToken(token) : null;
      const roomId = req.body.roomId;


      const queryString = `
          UPDATE messages
          SET unread = null
          WHERE receiverId = ? AND roomId = ?
      `;
      const result = await queryPromise(queryString, [authUserId, roomId]);
  

      res.json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
};