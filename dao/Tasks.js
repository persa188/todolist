const {
  mongoose
} = require("./mongooseProvider.js")

const {
  v4: uuidv4
} = require('uuid')

const taskSchema = new mongoose.Schema({
  _id: String, //username
  title: String,
  description: String,
  status: String,
  dueDate: String,
  category: String,
  owner: String,
}, {
  timestamps: true
});

const task = mongoose.model('Task', taskSchema);

async function getTask(taskId, context) {
  if (!context || !context.user.username) return;

  let result = await retrieveTask(context.user.username, taskId);
  return formatTaskResult(result)
}

async function retrieveTask(username, taskId) {
  const query = task.findOne({
    _id: taskId,
    owner: username
  }).exec();
  return query;
}

async function getTasks(args, context) {
  if (!context || !context.user.username) return;
  args.owner = context.user.username;
  const query = await task.find(args).exec();

  //transform each result into graphql schema format
  for (i = 0; i < query.length; i++) {
    query[i] = formatTaskResult(query[i]);
  }
  return query;
}

const createTask = async (title, description, status, dueDate, category, context) => {
  console.log(context.user.username)
  if (!context || !context.user.username) return;

  let t = new task({
    _id: uuidv4(),
    title: title,
    description: description,
    status: status,
    dueDate: dueDate,
    category: category,
    owner: context.user.username,
  });

  try {
    let result = await t.save();
    return formatTaskResult(result)
  } catch (err) {
    console.log(err);
  }

}

const updateTask = async (args, context) => {
  if (!context.user.username) return;
  if (!args.taskId) return;
  try {
    result = await task.findOneAndUpdate({
      _id: args.taskId,
      owner: context.user.username
    }, args, {
      upsert: true
    })

    return formatTaskResult(result);
  } catch (err) {
    console.log(err);
  }
}

const removeTask = async (taskId, context) => {
  if (!context.user.username) return;
  if (!taskId) return;
  try {
    result = await task.findOneAndDelete({
      _id: taskId,
      owner: context.user.username
    })

    return formatTaskResult(result);
  } catch (err) {
    console.log(err);
  }
}


function formatTaskResult(result) {
  return {
    taskId: result._id,
    title: result.title,
    description: result.description,
    status: result.status,
    dueDate: result.dueDate,
    updatedAt: result.updatedAt,
    createdAt: result.createdAt
  }
}

module.exports = {
  createTask,
  removeTask,
  getTask,
  getTasks,
  updateTask
}