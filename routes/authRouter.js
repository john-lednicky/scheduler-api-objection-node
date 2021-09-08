const express = require('express');
const passport = require('passport');

const router = express.Router();

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
  passport.authenticate('google', { session: false }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, will send the user as JSON to the browser
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.json(req.user);
  });

// GET /auth/google/profile
//   Uses a Google ID JWT bearer token.
//   Token is deserialized and signature is verified.
//   req.user is populated with the payload of the JWT.
//   Token only, from jmreyes passport-google-id-token
router.get('/google/profile',
  passport.authenticate('google-id-token', { session: false }),
  (req, res) => {
    res.json(req.user);
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
