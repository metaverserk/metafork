import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createConnection({
    host:"5.181.252.193",
    user:"admin",
    password:process.env.DB_PASS,
    database:"app",
    multipleStatements: true,
    debug: false,
    silent: true,
    charset: "utf8mb4", // установите нужную кодировку
    collation: "utf8mb4_unicode_ci", // установите нужную
     
});

export const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};