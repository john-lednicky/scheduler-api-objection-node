/* eslint-disable no-console */
const passport = require('passport');
const GoogleTokenStrategy = require('./passport-google-id-token');

const { GOOGLE_CLIENT_ID } = process.env;

module.exports = () => {
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
      },
      ((token, googleId, done) => {
        console.log(`googleId==${googleId}`);
        done(null, token);
      }),
    ),
  );
};
