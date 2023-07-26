import express from 'express';
import { getFollowers, getFollowing, addFollow, deleteFollow } from '../controllers/subscribe.js'

const router = express.Router();


router.post("/followers", getFollowers);
router.post("/following", getFollowing);
router.post("/follow", addFollow);
router.post("/unfollow", deleteFollow);

export default router;