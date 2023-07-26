import { db } from '../connect.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config();

const queryPromise = promisify(db.query).bind(db);



export const auth = (req,res) => {

    const wallet = req.body.wallet;

    const query = `
    SELECT
        users.*, usersData.name, usersData.verify, usersData.status, usersSocial.*
    FROM users
    LEFT JOIN usersData ON users.id = usersData.userId
    LEFT JOIN usersSocial ON users.id = usersSocial.userId
    WHERE users.wallet = ?`;

    db.query(query, [wallet], function(err, user) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log(user)
        if (!user.length) {
            const query = "INSERT INTO users (wallet) VALUES (?) RETURNING id";
            db.query(query, wallet, function(err, result) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                const userId = result[0].id;
                const insertQuery = "INSERT INTO usersData (userId) VALUES (?)";
                db.query(insertQuery, userId, function(err, result) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    const selectQuery = `SELECT users.*, usersData.name, usersData.verify, usersData.status, usersSocial.*
                    FROM users
                    LEFT JOIN usersData ON users.id = usersData.userId
                    LEFT JOIN usersSocial ON users.id = usersSocial.userId
                    WHERE users.id = ?`;
                    db.query(selectQuery, userId, function(err, user) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        const token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY)
                        res.cookie("accessToken", token, {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                        }).status(200).json(user[0]);
                    });
                });
            });
        } else {
            const token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY)
            res.cookie("accessToken", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            }).status(200).json(user[0]);
        }
    });  
}


export const logOut = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: "none",
        domain: 'localhost'
    }).status(200).json('User has been logged out');
}; 