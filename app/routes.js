 module.exports = function(app, express) {
  // Create Router Instance
  var router = express.Router();

  // Set Flash Messages
  router.use(function(req, res, next) {
    req.message = req.flash('info');
    next();
  });

  // Index
  router.get('/', function(req, res) {
    res.redirect('/projects');
  });

  // Project Routes
  require('./routes/projects')(app, express, router);

  // Todo Routes
  require('./routes/todos')(app, express, router);

  // apply routes to app
  app.use('/', router);

  // 404
  // app.use(function(req, res, next){
  //   res.status(404);
  //   res.render('errors/404');
  // });

 };
