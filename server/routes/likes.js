import express from 'express';
import {addLike, deleteLike} from '../controllers/like.js'

const router = express.Router();

router.post("/add", addLike);
router.post("/delete", deleteLike);

export default router;