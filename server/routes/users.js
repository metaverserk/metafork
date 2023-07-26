import express from 'express';
import { getUsers, getUser, changeAvatar, updateSettings, updateSocial } from '../controllers/user.js'

const router = express.Router();


router.post("/", getUsers);
router.post("/profile", getUser);
router.post("/avatar", changeAvatar);
router.post("/update", updateSettings);
router.post("/social", updateSocial);

export default router;