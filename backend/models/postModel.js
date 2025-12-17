const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // 👈 ¡ESTA LÍNEA ES CLAVE! Debe decir exactamente 'User'
    },
    text: {
        type: String,
        required: [true, 'Por favor teclea un mensaje']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);