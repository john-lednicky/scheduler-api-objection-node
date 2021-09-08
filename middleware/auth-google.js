/* eslint-disable no-console */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

module.exports = () => {
  // Configure the strategy for use by Passport.
  //
  // OAuth 2.0-based strategies require a `verify` function which receives the
  // credential (`accessToken`) for accessing the Google API on the user's
  // behalf, along with the user's profile.  The function must invoke `cb`
  // with a user object, which will be set at `req.user` in route handlers after
  // authentication.
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ['profile', 'openid', 'email'],
        state: false,
      },
      // eslint-disable-next-line arrow-body-style
      ((accessToken, refreshToken, profile, cb) => {
        // In this example, the user's Google profile is supplied as the user
        // record.  In a production-quality application, the Google profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        console.log(`accessToken==${accessToken}`);
        console.log(`refreshToken==${refreshToken}`);
        return cb(null, profile);
      }),
    ),
  );

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Facebook profile is serialized
  // and deserialized.
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
};
