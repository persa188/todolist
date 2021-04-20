const {mongoose} = require('./mongooseProvider.js');
const {v4: uuidv4} = require('uuid');

const taskSchema = new mongoose.Schema({
  _id: String, // username
  title: String,
  description: String,
  status: String,
  dueDate: Date,
  category: String,
  owner: String,
}, {
  // auto-add's created and update timestamps
  timestamps: true,
});

const task = mongoose.model('Task', taskSchema);


/** function that gets a specific task from db */
const getTask = async (taskId, context) => {
  if (!context || !context.user.username) return;

  const result = await retrieveTask(context.user.username, taskId);
  return formatTaskResult(result);
};

/**
 * function that queries tasks table for any tasks that have the current
 * logged in user as the owner & matches as many of the set args as possible.
 */
async function getTasks(args, context) {
  if (!context || !context.user.username) return;
  args.owner = context.user.username;

  // kind of meh, but
  const sortBy = (args.sortBy == 'DUE_DATE_DESC') ? 1 : -1;
  delete args.sortBy;

  const query = await task.find(args).sort({dueDate: sortBy}).exec();

  // transform each result into graphql schema format
  for (i = 0; i < query.length; i++) {
    query[i] = formatTaskResult(query[i]);
  }
  return query;
}

/**
* function that creates a task in the tasks table. This adds autogen fields like
* taskId & will log major errors to console. No validation of inputs is done,
* this function assumes golden data.
*/
const createTask = async (args, context) => {
  console.log(context.user.username);
  if (!context || !context.user.username) return;

  const t = new task({
    _id: uuidv4(),
    title: args.title,
    description: args.description,
    status: args.status,
    dueDate: args.dueDate,
    category: args.category,
    owner: context.user.username,
  });

  try {
    const result = await t.save();
    return formatTaskResult(result);
  } catch (err) {
    console.log(err);
  }
};


/**
 * function that updates task with args.taskId & current logged in user as owner.
 */
const updateTask = async (args, context) => {
  if (!context.user.username) return;
  if (!args.taskId) return;
  try {
    result = await task.findOneAndUpdate({
      _id: args.taskId,
      owner: context.user.username,
    }, args, {
      upsert: true,
    });

    return formatTaskResult(result);
  } catch (err) {
    console.log(err);
  }
};

/**
 * function that deletes task with taskId if owned by current logged in user.
 */
const removeTask = async (taskId, context) => {
  if (!context.user.username) return;
  if (!taskId) return;
  try {
    result = await task.findOneAndDelete({
      _id: taskId,
      owner: context.user.username,
    });

    return formatTaskResult(result);
  } catch (err) {
    console.log(err);
  }
};

// --- helpers ---
async function retrieveTask(username, taskId) {
  const query = task.findOne({
    _id: taskId,
    owner: username,
  }).exec();
  return query;
}

function formatTaskResult(result) {
  return {
    taskId: result._id,
    title: result.title,
    description: result.description,
    status: result.status,
    dueDate: result.dueDate,
    category: result.category,
    updatedAt: result.updatedAt,
    createdAt: result.createdAt,
  };
}

module.exports = {
  createTask,
  removeTask,
  getTask,
  getTasks,
  updateTask,
};
