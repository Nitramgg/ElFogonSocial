const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const cloudinary = require('cloudinary').v2;

// @desc    Obtener todos los posts
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('user', 'name foto');
    res.status(200).json(posts);
});

// @desc    Crear un post (Actualizado para Multimedia)
const setPost = asyncHandler(async (req, res) => {
    if (!req.body.text && !req.file) {
        res.status(400);
        throw new Error('Por favor teclea un mensaje o sube una imagen');
    }

    const postData = {
        text: req.body.text,
        user: req.user.id,
    };

    if (req.file) {
        if (req.file.mimetype.startsWith('video')) {
            postData.video = req.file.path;
        } else {
            postData.image = req.file.path;
        }
    }

    const post = await Post.create(postData);
    res.status(201).json(post);
});

// @desc    Eliminar un post
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post no encontrado');
    }

    if (post.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Usuario no autorizado');
    }

    if (post.image || post.video) {
        const fileUrl = post.image || post.video;
        const publicId = fileUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`el_fogon_posts/${publicId}`);
    }

    await post.deleteOne();
    res.status(200).json({ id: req.params.id });
});

// @desc    Dar o quitar like a un post (NUEVA FUNCIÓN)
const likePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post no encontrado');
    }

    // El ID del usuario viene de req.user.id (del middleware protect)
    const userId = req.user.id;

    // Si el usuario ya está en el array de likes, lo sacamos; si no, lo sumamos
    if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
        post.likes.push(userId);
    }

    await post.save();
    
    // Devolvemos el post actualizado con los likes
    res.status(200).json(post.likes);
});

module.exports = {
    getPosts,
    setPost,
    deletePost,
    likePost // No te olvides de exportarla aquí
};