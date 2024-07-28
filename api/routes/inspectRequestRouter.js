const express = require('express');
const createError = require('http-errors');
const bearerTokenService = require('../services/bearerTokenService');

const router = express.Router();

router.get('/tokenUserName', (req, res) => {
  res.json(req.tokenUserName);
});
router.get('/tokenUserEmail', (req, res) => {
  res.json(req.tokenUserEmail);
});

router.get('/headers/user', (req, res) => {
  res.json(req.header('x-forwarded-user"'));
});

router.get('/headers/accessToken/raw', (req, res) => {
  res.json(req.header('x-forwarded-access-token'));
});

router.get('/headers/accessToken', (req, res, next) => {
  const tokenHeader = req.header('x-forwarded-access-token');
  if (!tokenHeader) {
    next(createError(400, 'x-forwarded-access-token header not found'));
  }
  const encodedToken = tokenHeader;
  const splitToken = encodedToken.split('.');
  if (splitToken.length !== 3) {
    next(createError(400, 'Access token seems to be malformed. There are not three parts when split at dots.'));
  }
  const tokenParts = {};
  try {
    tokenParts.header = JSON.parse(Buffer.from(splitToken[0], 'base64').toString('utf8'));
  } catch (err) {
    next(createError(400, `Access token seems to be malformed. The JSON header could not be parsed. ${Buffer.from(splitToken[0], 'base64').toString('utf8')}`));
  }
  try {
    tokenParts.payload = JSON.parse(Buffer.from(splitToken[1], 'base64').toString('utf8'));
  } catch (err) {
    next(createError(400, `Access token seems to be malformed. The JSON payload could not be parsed. ${Buffer.from(splitToken[1], 'base64').toString('utf8')}`));
  }
  // eslint-disable-next-line prefer-destructuring
  tokenParts.signature = splitToken[2];

  res.json(tokenParts);
});

router.get('/headers/authorization/bearerToken/consume', async (req, res, next) => {
  try {
    const token = bearerTokenService.getTokenFromHeader(req.header('authorization'));
    const payload = await bearerTokenService.validateTokenReturnPayload(token);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

router.get('/headers/authorization/bearerToken', (req, res, next) => {
  const authHeader = req.header('authorization');
  if (!authHeader) {
    next(createError(400, 'authorization header not found'));
  }
  if (!authHeader.startsWith('Bearer ')) {
    next(createError(400, 'authorization header does not begin with "Bearer "'));
  }
  const encodedToken = authHeader.substring(6);
  const splitToken = encodedToken.split('.');
  if (splitToken.length !== 3) {
    next(createError(400, 'Bearer token seems to be malformed. There are not three parts when split at dots.'));
  }
  const tokenParts = {};
  try {
    tokenParts.header = JSON.parse(Buffer.from(splitToken[0], 'base64').toString('utf8'));
  } catch (err) {
    next(createError(400, `Bearer token seems to be malformed. The JSON header could not be parsed. ${Buffer.from(splitToken[0], 'base64').toString('utf8')}`));
  }
  try {
    tokenParts.payload = JSON.parse(Buffer.from(splitToken[1], 'base64').toString('utf8'));
  } catch (err) {
    next(createError(400, `Bearer token seems to be malformed. The JSON header could not be parsed. ${Buffer.from(splitToken[0], 'base64').toString('utf8')}`));
  }
  // eslint-disable-next-line prefer-destructuring
  tokenParts.signature = splitToken[2];

  res.json(tokenParts);
});

router.get('/headers/authorization', (req, res) => {
  res.json(req.header('authorization'));
});

router.get('/headers', (req, res) => {
  res.json(req.headers);
});

module.exports = router;
