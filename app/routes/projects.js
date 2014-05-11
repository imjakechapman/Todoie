/**
** Module Dependencies
**/
var projectController = require('../controllers/projectController');

module.exports = function(app, express, router) {

  // Load Project
  router.param('project_id', projectController.load);
  app.param('project_id', projectController.load);

  // Load Project Todo
  router.param('todo_id', projectController.loadTodo);
  app.param('todo_id', projectController.loadTodo);

  // Chaining Routes using app.route
  app.route('/projects')
    .get(projectController.list)
    .post(projectController.create);


  // Show project
  router.get('/projects/:project_id', projectController.show);

  // Delete project
  router.get('/projects/:project_id/delete', projectController.delete);

  // Edit / Update Project
  app.route('/projects/:project_id/edit')
    .get(projectController.edit)
    .put(projectController.update);

  // Create project todo
  router.post('/projects/:project_id/todos', projectController.createTodo);

  // Edit project todo
  app.route('/projects/:project_id/todos/:todo_id/edit')
    .get(projectController.editTodo)
    .put(projectController.updateTodo);

  // Complete Project Todo
  router.get('/projects/:project_id/todos/:todo_id/complete', projectController.completeTodo);

  // Remove Complete Project Todos
  router.get('/projects/:project_id/removeCompleted', projectController.removeCompleted);

  // Delete Project Todo
  router.get('/projects/:project_id/todos/:todo_id/delete', projectController.destroyTodo);

};
