const {
  gql,
} = require('apollo-server');

const typeDefs = `
type User {
  username: String!
  token: String
}

enum sortBy {
  DUE_DATE_ASC
  DUE_DATE_DESC
}

type Task {
  taskId: ID!
  title: String!
  description: String!
  status: String!
  dueDate: String!
  category: String
  createdAt: String
  updatedAt: String
}

type Query {
  tasks(title: String, description: String, sortBy: sortBy, status: String, dueDate: String, category: String, createdAt: String, updatedAt: String): [Task]
  task(taskId: ID!): Task
}

type Mutation {
  login(username: String!, password: String!): User
  register(username: String!, password: String!): User
  createTask(title: String!, description: String!, status: String!, dueDate: String!, category: String): Task
  updateTask(taskId: ID!, title: String, description: String, status: String, dueDate: String, category: String): Task,
  removeTask(taskId: ID!): Task
}
`;

module.exports = {
  typeDefs,
};
