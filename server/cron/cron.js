import { db } from '../connect.js';
import cron from 'node-cron'
import { promisify } from 'util';
import axios from 'axios';
import fs from 'fs';

const queryPromise = promisify(db.query).bind(db);

// Функция для очистки таблицы blocked
const clearBlockedTable = async () => {

    try {
        const query = `
            DELETE FROM
                blocked
        `;

        const deleteBlocked = await queryPromise(query);

    } catch (error) {
        console.error(error);
    }
}


const updateAuthToken = async () => {
  try {
      const response = await axios.get('https://api.selcdn.ru/auth/v1.0', {
          headers: {
              'X-Auth-User': '260513_Gretchen',
              'X-Auth-Key': 'G=i5k?br[;'
          }
      });

      const authToken = response.headers['x-auth-token'];
      console.log(authToken)

      // Проверяем, есть ли запись с id 1
      const checkQuery = "SELECT COUNT(*) as count FROM authData WHERE id = 1";
      const checkResult = await queryPromise(checkQuery);

      if (checkResult[0].count > 0) {
          // Если запись существует, обновляем ее
          const updateQuery = `UPDATE authData SET authToken = '${authToken}' WHERE id = 1`;
          await queryPromise(updateQuery);
      } else {
          // Если записи нет, вставляем новую
          const insertQuery = `INSERT INTO authData (id, authToken) VALUES (1, '${authToken}')`;
          await queryPromise(insertQuery);
      }

      console.log('X-Auth-Token updated');
  } catch (error) {
      console.log(error);
  }
};



cron.schedule('0 */2 * * *', () => {
    console.log('Таблица очищена');
    clearBlockedTable();
});

// cron.schedule('0 */2 * * *', () => {
//     console.log('Токен обновлен');
//     updateAuthToken();
// });

// 2 минуты
//  cron.schedule('*/1 * * * *', () => {

cron.schedule('0 */1 * * *', () => {
    console.log('Токен обновлен');
    updateAuthToken();
});