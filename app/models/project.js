var mongoose = require('mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({

  name: {
    type: String,
    trim: true,
    required: '{PATH} is required!'
  },
  todos: [{
    type: Schema.Types.ObjectId,
    ref: 'Todo'
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date

});


// Updates project.updated_at and saves project.created_at if initial save
ProjectSchema.pre('save', function(next){
  this.updated_at = new Date();
  next();
});

ProjectSchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb);
  }

};


/*
 * FilteredTodos
 *
 * Returns a filtered array of todo items for a project model
 *
 * @param (Boolean) True to return completed tasks, false to return uncompleted tasks
 * @return (Array)
 */
ProjectSchema.methods.filteredTodos = function(bool) {
  var bool = bool !== undefined ? bool : false;
  return _.filter(this.todos, function(todo) {
    if(!bool) {
      if(!todo.completed) return todo;
    } else {
      if(todo.completed) return todo;
    }
  });

};


/*
 * hasCompleted
 * Returns true if project has any completed todos
 *
 * @return (Bool)
 */
ProjectSchema.methods.hasCompleted = function () {
  var c = false;
  _.filter(this.todos, function(todo) {
    if (todo.completed) {
      c = true;
    }
  });

  return c;
};

module.exports = mongoose.model('Project', ProjectSchema);
