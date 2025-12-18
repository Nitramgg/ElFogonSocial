const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: [true, 'Por favor teclea un mensaje']
    },
    // --- CAMPOS NUEVOS PARA MULTIMEDIA ---
    image: {
        type: String, // Aquí guardaremos la URL de Cloudinary
        default: null
    },
    video: {
        type: String, // URL del video si el socio sube uno
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);