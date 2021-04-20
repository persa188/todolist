const {login, retrieveUser, register} = require('../dao/Users.js');
const {createTask, getTask, getTasks, updateTask, removeTask} = require('../dao/Tasks.js');

const resolvers = {
  // GraphQL Queries
  Query: {
    task: async (_, {
      taskId,
    }, context) => getTask(taskId, context),
    tasks: async (_, args, context) => getTasks(args, context),
  },
  // GraphQL Mutations
  Mutation: {
    login: async (_, args) => login(args),
    register: async (_, args) => register(args),
    createTask: async (_, args, context) => createTask(args, context),
    updateTask: async (_, args, context) => updateTask(args, context),
    removeTask: async (_, {
      taskId,
    }, context) => removeTask(taskId, context),
  },
};

module.exports = {
  resolvers,
};
