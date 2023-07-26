import express from 'express';
import { getMessagesCount, getNotify, readNotify, getNotifyCount } from '../controllers/notify.js'

const router = express.Router();

router.post("/", getNotify);
router.post("/messages", getMessagesCount);
router.post("/count", getNotifyCount);
router.post("/read", readNotify);

export default router;