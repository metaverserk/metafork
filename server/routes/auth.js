import express from 'express';
import {auth, logOut} from '../controllers/auth.js'

const router = express.Router();

router.post("/", auth);
router.post("/logout", logOut);

export default router;