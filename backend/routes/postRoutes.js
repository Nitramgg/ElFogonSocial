const express = require('express');
const router = express.Router();
const { getPosts, setPost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // 👈 Importamos el subidor

 router.route('/')
    .get(getPosts)
    .post(protect, upload.single('file'), setPost); 

router.route('/:id').delete(protect, deletePost);

module.exports = router;