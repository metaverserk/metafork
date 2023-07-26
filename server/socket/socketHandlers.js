import { db } from '../connect.js';
import { promisify } from 'util';


const queryPromise = promisify(db.query).bind(db);

export function handleConnection(socket, io) {
    console.log('user connected', socket.id);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    // Прослушивание события добавления нового сообщения
    socket.on('sendMessage', (messageData) => {
        const roomId = messageData.roomId;

        socket.join(roomId);
        // отправка сообщения всем участникам комнаты
        io.to(roomId).emit('updateMessage', messageData);
    });

    // Прослушивание события обновления диалога
    socket.on('sendDialog', (receiverId) => {
        console.log(receiverId)
        // отправка сообщения всем участникам комнаты
        io.emit('updateDialog', receiverId);
    });


    // Прослушивание непрочитанных сообщений
    socket.on('sendUnreadMessages', async (userId) => {
        // отправка значения непрочитанных сообщений
        io.emit('updateUnreadMessages', userId);
    });


    socket.on('addComment', (newComment) => {
        // отправляем запрос на клиентскую сторону через сокеты
        io.emit('updateUnreadNotify', { userId: newComment.post.userId });
    });

    socket.on('addNotifyUnread', async (postUserId) => {
        const query = `
             SELECT
                 CASE WHEN EXISTS (
                     SELECT *
                     FROM notifications
                     WHERE userId = ? AND unread = 1
                 ) THEN true ELSE false END AS unread
             FROM dual
        `;
        const notify = await queryPromise(query, [postUserId]);
        // // отправка уведомления об изменении статуса непрочитанных сообщений
        io.emit('updateUnreadNotify', { userId: postUserId });
    });
}