// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const {
  login,
  retrieveUser,
  register
} = require("../dao/Users.js");

const {
  createTask,
  getTask,
  getTasks,
  updateTask,
  removeTask
} = require("../dao/Tasks.js")

const resolvers = {
  Query: {
    task: async (_, {
      taskId
    }, context) => getTask(taskId, context),
    tasks: async (_, args, context) => getTasks(args, context)
  },
  Mutation: {
    login: async (_, {
      username,
      password
    }) => login(username, password),
    register: async (_, {
      username,
      password
    }) => register(username, password),
    createTask: async (_, {
      title,
      description,
      status,
      dueDate,
      category
    }, context) => createTask(title, description, status, dueDate, category, context),
    updateTask: async (_, args, context) => updateTask(args, context),
    removeTask: async (_, {
      taskId
    }, context) => removeTask(taskId, context)
  }
};

module.exports = {
  resolvers
};