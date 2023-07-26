import express from 'express';
import { getPosts, getAllPosts, getSearchPosts, getUserPosts, deletePost, createPost, getPost, editPost } from '../controllers/post.js'

const router = express.Router();

router.post("/", getPosts);
router.post("/feed", getAllPosts);
router.post("/search", getSearchPosts);
router.post("/user", getUserPosts);
router.post("/post", getPost);
router.post("/delete", deletePost);
router.post("/create", createPost);
router.post("/edit", editPost);

export default router;