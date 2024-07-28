const createError = require('http-errors');
const bearerTokenService = require('../services/bearerTokenService');

exports.tokenHandler = async (req, res, next) => {
  try {
    const authToken = bearerTokenService.getTokenFromHeader(req.header('authorization'));
    let authPayload = null;
    authPayload = await bearerTokenService.validateTokenReturnPayload(authToken);
    req.tokenUserEmail = authPayload.email;
    req.tokenUserName = authPayload.name;
  } catch (e) {
    next(createError(403, e));
  }

  next();
};
