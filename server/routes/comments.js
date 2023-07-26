import express from 'express';
import { getComments, createComment, deleteComment } from '../controllers/comment.js'

const router = express.Router();

router.post("/", getComments);
router.post("/create", createComment);
router.post("/delete", deleteComment);

export default router;