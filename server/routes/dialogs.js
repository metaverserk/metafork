import express from 'express';
import {getUserDialogs, getMessages, createMessage, readMessage, getDialogUserData} from '../controllers/dialog.js'

const router = express.Router();

router.post("/", getUserDialogs);
router.post("/messages", getMessages);
router.post("/create", createMessage)
router.post("/read", readMessage)
router.post("/user", getDialogUserData)


export default router;