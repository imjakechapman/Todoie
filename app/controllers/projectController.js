/*
 * Module Dependencies
 */
 var mongoose = require('mongoose'),
     _ = require('underscore'),
     Project = mongoose.model('Project'),
     Todo = mongoose.model('Todo');


/**
* Load Project
*/
exports.load = function(req, res, next, id) {

  Project.load(id, function (err, project) {
    if (err) return next(err);
    if (!project) return next(new Error('project not found'));
    req.project = project;
    next();
  });

};


/**
* List Projects
*/
exports.list = function(req, res) {

  Project.find({})
    .populate({
      path: 'todos',
      select: 'completed',
    })
    .exec(function(err, projects) {
      if (err) {
        console.log(err);
        return;
      }

      res.render("projects/index", {
        projects: projects,
        message: req.message
      });
  });

};


/**
* Create Project
*/
exports.create = function(req, res) {

  var project = new Project();
  project.name = req.body.projectName;
  project.save(function(err) {

    // Error saving, flash error and redirect
    if(err) {
      req.flash('info', err.errors.name.message);
      return res.redirect('/');
    }

    // No error, flash created message and redirect
    req.flash('info', 'Project was successfully created');
    res.redirect('/');

  });
};



/**
* Show Project
*/
exports.show = function(req, res) {

  Project.findOne({ _id: req.project._id})
    .populate({
      path: 'todos',
      options: {sort: { completed: 1 }}
    })
    .exec(function(err, project) {
    if (err) {
      console.log(err);
      return;
    }

    res.render("projects/show", {
      project: project,
      message: req.message,
      completion: (project.todos.length) ? Math.floor( (completed(project.todos) / project.todos.length) * 100 ) + '%' : 0
    });

  });

};


/**
* Edit Project
*/
exports.edit = function(req, res) {
  res.render('projects/edit', {
    project: req.project
  });
};


/**
* Update Project
*/
exports.update = function(req, res) {
  var project = req.project;
  project.name = req.body.name;

  project.save(function(err) {
    if (err) {
      req.flash('info', 'Could not update project. Please try again.');
      return res.redirect('/');
    }

    req.flash('info', 'Project successfully updated');
    res.redirect('/projects/' + project._id);
  });
};


/**
** Delete Project
**/
exports.delete = function(req, res) {
  var project = req.project;

  project.remove(function(err) {
    // Error deleting
    if(err) {
      req.flash('info', 'Could not deleted project. Please try again');
      return res.redirect('/');
    }

    // No error, flash created message and redirect
    req.flash('info', 'Project Successfully Deleted');
    res.redirect('/');
  });
};



//////// Project Todos

/**
* Load Project Todo
*/
exports.loadTodo = function(req, res, next, id) {

  Todo.load(id, function (err, todo) {
    if (err) return next(err);
    if (!todo) return next(new Error('project todo not found'));
    req.todo = todo;
    next();
  });

};


/**
* Create Project Todo
*/
exports.createTodo = function(req, res) {
  var todo = new Todo({
    description: req.body.description,
    completed: false,
    project: req.project._id
  });

  todo.save(function(err) {
    if(err) throw err;

    var project = req.project;
    project.todos.push(todo);
    project.save(function(err) {
      if (err) throw err;

      res.redirect('/projects/' + project._id);
    });
  });

};


/**
* Edit Project Todo
*/
exports.editTodo = function(req, res) {
  console.log(req.todo);

  Todo.findOne({ _id: req.todo._id})
    .populate({
      path: 'project',
      select: '_id'
    })
    .exec(function(err, todo) {
      if (err) throw err;

      console.log(todo);
      res.render('todos/edit', {
        todo: todo
      });
    });
};

/**
* Update Project Todo
*/
exports.updateTodo = function(req, res) {
  var todo = req.todo;
  todo.description = req.body.description;

  todo.save(function(err) {
    if (err) {
      req.flash('info', 'Could not update todo. Please try again.');
      return res.redirect('/projects/' + req.project._id + '/todos/' + todo._id + '/');
    }

    req.flash('info', 'Todo successfully updated');
    res.redirect('/projects/' + req.project._id);
  });
};

/**
* Complete Project Todo
*/
exports.completeTodo = function(req, res) {
  var todo = req.todo;
  todo.completed = true;

  todo.save(function(err) {
    if (err) {
      req.flash('info', 'Could not update todo. Please try again.');
      return res.redirect('/projects/' + req.project._id);
    }

    req.flash('info', 'Todo successfully updated');
    res.redirect('/projects/' + req.project._id);
  });
};


/**
* Delete Project Todo
*/
exports.destroyTodo = function(req, res) {
  Todo.remove({ _id: req.todo._id }, function(err) {
    if (err) {
      req.flash('info', 'Could not delete task, please try again');
      return res.redirect('/projects/' + req.project._id);
    }

    req.flash('info', 'Task Deleted');
    return res.redirect('/projects/' + req.project._id);
  });
};


/**
* Remove Completed Todos
*/
exports.removeCompleted = function(req, res) {
  Todo.remove({ project: req.project._id, completed: true }, function(err) {
    if (err) {
      req.flash('info', 'Could not remove completed tasks, please try again');
      return res.redirect('/projects/' + req.project._id);
    }

    req.flash('info', 'Completed Tasks Removed');
    return res.redirect('/projects/' + req.project._id);
  });
};


// Return length of filtered items
function completed(collection) {
  var c = 0;
  _.filter(collection, function(todo) {
    if (todo.completed) c++;
  });

  return c;
}
