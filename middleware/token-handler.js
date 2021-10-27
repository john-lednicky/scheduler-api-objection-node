const createError = require('http-errors');
const bearerTokenService = require('../services/bearerTokenService');

exports.tokenHandler = async (req, res, next) => {
  const authToken = bearerTokenService.getTokenFromHeader(req.header('authorization'));
  let authPayload = null;
  try {
    authPayload = await bearerTokenService.validateTokenReturnPayload(authToken);
  } catch (e) {
    next(createError(403, e));
  }
  req.tokenUserEmail = authPayload.email;
  req.tokenUserName = authPayload.name;

  next();
};
