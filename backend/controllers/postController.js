const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');

// @desc    Obtener todos los posts
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('user', 'name foto');
    res.status(200).json(posts);
});

// @desc    Crear un post
const setPost = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Por favor teclea un mensaje');
    }

    const post = await Post.create({
        text: req.body.text,
        user: req.user.id,
    });

    res.status(201).json(post);
});

// @desc    Eliminar un post (ESTA ES LA QUE FALTABA DEFINIR)
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post no encontrado');
    }

    // Verificar que el usuario sea el dueño del post
    if (post.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Usuario no autorizado');
    }

    await post.deleteOne();
    res.status(200).json({ id: req.params.id });
});

// Al final, exportamos las TRES funciones
module.exports = {
    getPosts,
    setPost,
    deletePost
};