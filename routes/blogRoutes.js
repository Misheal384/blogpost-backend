const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticateUser = require('../middleware/authMiddleware');

// Routes open to everyone (public)
router.get('/posts', blogController.getAllPosts);
router.get('/posts/search', blogController.searchPosts);
router.get('/posts/:id', blogController.getPostById);

// Routes protected by authentication
router.post('/posts', authenticateUser, blogController.createPost);
router.get('/my-posts', authenticateUser, blogController.getMyPosts);
router.put('/posts/:id', authenticateUser, blogController.updatePost);
router.delete('/posts/:id', authenticateUser, blogController.deletePost);

module.exports = router;
