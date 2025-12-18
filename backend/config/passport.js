const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://elfogonsocial.onrender.com/api/users/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    const newUser = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      foto: profile.photos[0].value
    }

    try {
      // Buscamos si el usuario ya existe
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Si existe, lo actualizamos con su Google ID si no lo tenía
        user.googleId = profile.id;
        await user.save();
        done(null, user);
      } else {
        // Si no existe, lo creamos
        user = await User.create(newUser);
        done(null, user);
      }
    } catch (err) {
      console.error(err);
      done(err, null);
    }
  }
));

// Necesario para que passport funcione
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});