/**
 * jwt stuff
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, 'private.key'));

// creates a token with {username: 'actual_logged_in_user'} as contents
// so that apis can grab current logged in user whenever needed
const sign = (data) => {
  return jwt.sign(data, privateKey, {
    algorithm: 'HS256',
  });
};

const cert = fs.readFileSync(path.join(__dirname, 'private.key'));
// validate and decodes token so we can authenticate and grab current user from jwt
const verify = async (token) => {
  try {
    const decoded = await jwt.verify(token, cert, {
      algorithms: ['HS256'],
    });
    return decoded;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  sign,
  verify,
};
