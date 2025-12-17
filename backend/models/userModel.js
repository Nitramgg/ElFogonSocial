const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor agrega un nombre'],
    },
    email: {
      type: String,
      required: [true, 'Por favor agrega un correo'],
      unique: true, // No puede haber dos usuarios con el mismo email
    },
    password: {
      type: String,
      // No es requerido para los que entran con Google
      required: function() { return !this.googleId; } 
    },
    googleId: {
      type: String, // Aquí guardaremos el ID único que nos da Google
    },
    foto: {
      type: String, // Para guardar la foto de perfil que trae de Google
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);