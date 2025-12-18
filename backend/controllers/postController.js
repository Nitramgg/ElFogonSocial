const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
// Importamos cloudinary para poder borrar archivos de la nube si eliminamos el post
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

    // Preparamos el objeto del post
    const postData = {
        text: req.body.text,
        user: req.user.id,
    };

    // Si viene un archivo desde el middleware de Cloudinary
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

    // OPCIONAL: Lógica para borrar la imagen de Cloudinary al borrar el post
    if (post.image || post.video) {
        const fileUrl = post.image || post.video;
        // Extraemos el ID público de la URL para borrarlo en Cloudinary
        const publicId = fileUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`el_fogon_posts/${publicId}`);
    }

    await post.deleteOne();
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getPosts,
    setPost,
    deletePost
};