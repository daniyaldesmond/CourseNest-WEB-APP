import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  likePost,
  addComment
} from '../controllers/postController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(optionalProtect, getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(optionalProtect, getPostById);

router.route('/:id/like')
  .post(protect, likePost);

router.route('/:id/comments')
  .post(protect, addComment);

export default router;
