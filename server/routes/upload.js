import express from 'express';
import {uploadPostImage, uploadAvatar, uploadPostVideo} from '../controllers/upload.js'

const router = express.Router();

router.post("/image", uploadPostImage);
router.post("/video", uploadPostVideo);
router.post("/avatar", uploadAvatar);

export default router;