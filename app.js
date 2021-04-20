const {ApolloServer} = require('apollo-server');
const {verify} = require('./jwt/jwt.js');
const {resolvers} = require('./resolvers/resolvers.js');
const {typeDefs} = require('./schema/schema.js');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({
    req,
  }) => {
    // try to get token from header
    const token = req.headers.authorization || '';
    let user = '';

    if (token) {
      user = await verify(token);
    }

    // add username to context
    return {
      user,
    };
  },
});

// The `listen` method launches a web server.
server.listen().then(({
  url,
}) => {
  console.log(`🚀  Server ready at ${url}`);
});
