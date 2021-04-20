/**
 * jwt stuff
 */

const jwt = require("jsonwebtoken")
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, 'private.key'));

//goign to skip adding exp date to token, too much work for a proto
const sign = (data) => {
  return jwt.sign(data, privateKey, {
    algorithm: "HS256"
  });
}

const cert = fs.readFileSync(path.join(__dirname, 'private.key'));
const verify = async (token) => {
  try {
    let decoded = await jwt.verify(token, cert, {
      algorithms: ["HS256"]
    })
    return decoded
  } catch (err) {
    console.log(err);
    return null;
  }

}

module.exports = {
  sign,
  verify
}