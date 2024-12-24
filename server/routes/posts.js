import express from 'express'
import { getPosts,getPost , createPost,updatePost,deletePost,likePost,getPostsBySearch,commentPost,deleteComment} from '../controllers/posts.js';
const router=express.Router();
import auth from '../middleware/auth.js';

//http://localhost:5000/posts
router.get('/search',getPostsBySearch)
router.get('/',getPosts)
router.get('/:id',getPost)
router.post('/',auth,createPost)
router.patch('/:id',auth,updatePost)//used for updatin existing
router.delete('/:id',auth,deletePost);
router.patch('/:id/likePost',auth,likePost);
router.post('/:id/commentPost',auth,commentPost)
router.delete('/:postId/comment', auth, deleteComment);


export default router