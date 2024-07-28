const createError = require('http-errors');
const { importJWK, createRemoteJWKSet, jwtVerify } = require('jose');

const iss = process.env.OAUTH_ISSUER || 'https://lednicky.localhost/dex';
const aud = process.env.OAUTH_AUDIENCE || 'lednicky.localhost';

exports.validateTokenReturnPayload = async (token, key = null) => {
  try {
    let keyset = {};
    let clockTolerance = 300; // Five minutes allowed for clock skew.
    if (key) {
      keyset = await importJWK(key, 'PS256');
      clockTolerance = 315360000; // Ten year clock tolerance if a test key was passed in.
    } else {
      keyset = createRemoteJWKSet(new URL(`${iss}/keys`));
    }
    const { payload } = await jwtVerify(token, keyset, {
      issuer: iss,
      audience: aud,
      clockTolerance,
    });
    return payload;
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.getTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    throw createError(400, 'authorization header not found');
  }
  if (!authHeader.startsWith('Bearer ')) {
    throw createError(400, 'authorization header does not begin with "Bearer "');
  }
  const token = authHeader.substring(7);
  return token;
};
