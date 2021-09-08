/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/**
 * Module dependencies.
 */
const util = require('util');
const Strategy = require('passport-strategy');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

/**
 * `Strategy` constructor.
 *
 * The Google authentication strategy authenticates requests by verifying the
 * signature and fields of the token.
 *
 * Applications must supply a `verify` callback which accepts the `idToken`
 * coming from the user to be authenticated, and then calls the `done` callback
 * supplying a `parsedToken` (with all its information in visible form) and the
 * `googleId`.
 *
 * Options:
 * - `clientID` your Google application's client id (or several as Array)
 * - `getGoogleCerts` optional custom function that returns the Google certificates
 *
 * Examples:
 *
 * passport.use(new GoogleTokenStrategy({
 *     clientID: '123-456-789',
 *     getGoogleCerts: optionalCustomGetGoogleCerts
 *   },
 *   function(parsedToken, googleId, done) {
 *     User.findOrCreate(..., function (err, user) {
 *       done(err, user);
 *     });
 *   }
 * ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function GoogleTokenStrategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  if (!verify) throw new Error('GoogleTokenStrategy requires a verify function');

  this._passReqToCallback = options.passReqToCallback;

  this._clientID = options.clientID;
  this._jwtOptions = options.jwtOptions || {};
  this._getGoogleCerts = options.getGoogleCerts || getGoogleCerts;

  Strategy.call(this);
  this.name = 'google-id-token';
  this._verify = verify;
}

/**
 * Return the Google certificate that will be used for signature validation.
 *
 * A custom function can be used instead when passed as an option in the Strategy
 * constructor. It can be interesting e.g. if caching is needed.
 *
 * @param {String} kid The key id specified in the token
 * @param {Function} callback
 * @api protected
 */
async function getGoogleCerts(kid) {
  const client = jwksClient({
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    requestHeaders: {}, // Optional
    timeout: 30000, // Defaults to 30s
  });

  const key = await client.getSigningKey(kid);
  const cert = key.getPublicKey();
  return cert;
}

function getBearerToken(headers) {
  if (headers && headers.authorization) {
    const parts = headers.authorization.split(' ');
    return (parts.length === 2 && parts[0] === 'Bearer') ? parts[1] : undefined;
  }
  return undefined;
}

/**
 * Inherit from `Strategy`.
 */
util.inherits(GoogleTokenStrategy, Strategy);

/**
 * Authenticate request by verifying the token
 *
 * @param {Object} req
 * @api protected
 */
GoogleTokenStrategy.prototype.authenticate = function (req, options) {
  options = options || {};
  const self = this;

  const idToken = (req.body && (req.body.id_token || req.body.access_token))
    || (req.query && (req.query.id_token || req.query.access_token))
    || (req.headers && (req.headers.id_token || req.headers.access_token))
    || (getBearerToken(req.headers));

  if (!idToken) {
    return self.fail({ message: 'no ID token provided' });
  }

  self._verifyGoogleToken(idToken,
    self._clientID,
    self._getGoogleCerts,
    self._jwtOptions,
    (err, payload, info) => {
      if (err) return self.fail({ message: err.message });

      if (!payload) return self.fail(info);

      function verified(err, user, info) {
        if (err) return self.error(err);
        if (!user) return self.fail(info);
        self.success(user, info);
      }

      if (self._passReqToCallback) {
        self._verify(req, payload, payload.sub, verified);
      } else {
        self._verify(payload, payload.sub, verified);
      }
    });
};

/**
 * Verify signature and token fields
 *
 * @param {String} idToken
 * @param {String} clientID
 * @param {Function} done
 * @api protected
 */
// eslint-disable-next-line consistent-return
GoogleTokenStrategy.prototype._verifyGoogleToken = async (token, clientID, getCerts, opts, done) => {
  const decodedToken = jwt.decode(token, { complete: true, json: true });

  if (!decodedToken) {
    return done(null, false, { message: 'malformed idToken' });
  }

  const { kid } = decodedToken.header;

  const cert = await getCerts(kid);
  if (!cert) return done('Failed to get Google public signing key needed to verify signature of JWT.');

  const options = opts;

  // verify audience as well as signature
  options.audience = clientID;
  options.issuer = [
    'accounts.google.com',
    'https://accounts.google.com',
  ];
  options.algorithms = ['RS256'];
  try {
    const verified = jwt.verify(token, cert, options);
    if (verified) {
      done(null, decodedToken.payload);
    } else {
      done(null, false, { message: 'jwt invalid' });
    }
  } catch (err) {
    done(null, false, { message: err.message });
  }
};

/**
 * Expose `GoogleTokenStrategy`.
 */
module.exports = GoogleTokenStrategy;
