const mongoose = require('mongoose');

/*
 * not sure what the javascript way to provide this is, but lets
 * just assume this is threadsafe lol
 */
mongoose.connect("mongodb+srv://daniel:survival123@main.3skav.mongodb.net/todolist?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//fixes deprecation error for findOneAndUpdate
mongoose.set('useFindAndModify', false);

module.exports = {
  mongoose
};