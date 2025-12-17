const express = require('express');
const router = express.Router();
const { getPosts, setPost, deletePost } = require('../controllers/postController'); // <--- Aquí también debe estar
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPosts).post(protect, setPost);
router.route('/:id').delete(protect, deletePost); // Esta es la línea 8 que causaba el crash

module.exports = router;