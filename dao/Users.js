const bcrypt = require('bcrypt');
const {
  mongoose,
} = require('./mongooseProvider.js');

const {
  sign,
} = require('../jwt/jwt.js');

// user schema
const UserSchema = new mongoose.Schema({
  _id: String, // username
  password: String,
});

// middleware on schema to make life easier
UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// model
const User = mongoose.model('User', UserSchema);

// bcrypt
const saltRounds = 10;

// register function, returns a token on succesful registration - null token otherwise.
const register = async (args) => {
  const username = args.username;
  const password = args.password;

  const u = new User({
    _id: username,
    // always salt & hash passwords :o
    password: password,
  });

  try {
    // we may fail to save if username exists, if so catch and log error
    const result = await u.save();
    return {
      username: username,
      token: sign({
        username: username,
      }),
    };
  } catch (err) {
    console.log(err);
  }
};

// login function, returns a token on succesful login - null token otherwise.
const login = async (args) => {
  // too lazy to sanitize these, lets assume good vals for demo :)
  const username = args.username;
  const password = args.password;

  // grab user from db..
  const result = await retrieveUser(username, password);

  // compare plaintext supplies vs salted hash in db.
  const isValidCredentials = await bcrypt.compare(password, result.password);
  // if bcrypt validated password matches hash, return token cotaining username
  if (isValidCredentials) {
    return {
      username: username,
      token: sign({
        username: username,
      }),
    };
  }
};

async function retrieveUser(uname) {
  const query = User.findOne({
    _id: uname,
  }).exec();
  return query;
}

module.exports = {
  login,
  register,
  retrieveUser,
};
