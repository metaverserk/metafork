import express from 'express';
import {  getReply, deleteReply, createReply } from '../controllers/reply.js'

const router = express.Router();

router.post("/", getReply);
router.post("/create", createReply);
router.post("/delete", deleteReply);

export default router;