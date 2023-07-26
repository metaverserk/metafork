import { db } from '../connect.js';
import { userToken } from '../shared/userToken.js';
import { promisify } from 'util';
import { pagination } from '../shared/pagination.js';

const queryPromise = promisify(db.query).bind(db);

//Получение уведомлений в центре
export const getNotify = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;

    try {
        const query = `
            SELECT
                *
            FROM notifications
            WHERE userId = ?
            ORDER BY date DESC
        `;

        const notify = await queryPromise(query, [authUserId]);
    
        const dataType = notify;
        const page = parseInt(req.query.page);
        const limit = 10;
        const results = pagination(dataType, page, limit);

        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 


//Получение уведомлений о сообщениях
export const getMessagesCount = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;

    try {
        const query = `
            SELECT
                CASE WHEN EXISTS (
                    SELECT *
                    FROM messages
                    WHERE receiverId = ? AND unread = 1
                ) THEN true ELSE false END AS unread
            FROM dual
        `;

        const notify = await queryPromise(query, [authUserId]);

        res.send(notify[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 

//Получение уведомлений о сообщениях
export const getNotifyCount = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;

    try {
        const query = `
            SELECT
                CASE WHEN EXISTS (
                    SELECT *
                    FROM notifications
                    WHERE userId = ? AND unread = 1
                ) THEN true ELSE false END AS unread
            FROM dual
        `;

        const notify = await queryPromise(query, [authUserId]);

        res.send(notify[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 


//Прочтение уведомлений в центре
export const readNotify = async (req, res) => {
    const token = req.cookies.accessToken;
    const authUserId = token ? userToken(token) : null;

    try {
        const query = `
            UPDATE notifications
            SET unread = 0
            WHERE userId = ?
        `;

        const result = await queryPromise(query, [authUserId]);

        res.status(204).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};