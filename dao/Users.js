const bcrypt = require('bcrypt');
const {
  mongoose
} = require("./mongooseProvider.js")

const {
  sign
} = require("../jwt/jwt.js")

//user schema
const UserSchema = new mongoose.Schema({
  _id: String, //username
  password: String,
});

//middleware on schema to make life easier
UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, saltRounds)
  next();
});

//model
const User = mongoose.model('User', UserSchema);

//bcrypt
const saltRounds = 10;

//register function
const register = async (username, password) => {
  let u = new User({
    _id: username,
    //always salt & hash passwords :o
    password: password
  })

  try {
    //we may fail to save if username exists, if so catch and log error
    let result = await u.save();
    return {
      username: username,
      token: sign({
        username: username
      })
    }
  } catch (err) {
    console.log(err);
  }
}

const login = async (username, password) => {
  //grab user from db..
  let result = await retrieveUser(username, password);

  //compare plaintext supplies vs salted hash in db.
  let isValidCredentials = await bcrypt.compare(password, result.password);
  //if bcrypt validated password matches hash, return token cotaining username
  if (isValidCredentials) {
    return {
      username: username,
      token: sign({
        username: username
      })
    }
  }

}

async function retrieveUser(uname) {
  const query = User.findOne({
    _id: uname
  }).exec();
  return query;
}

module.exports = {
  login,
  register,
  retrieveUser
}