var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TodoSchema = new Schema({

  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  description: {
    type: String,
    trim: true,
    required: '{PATH} is required!'
  },
  completed: {
    type: Boolean,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date

});


// Updates todo.updated_at and saves todo.created_at if initial save
TodoSchema.pre('save', function(next){
  this.updated_at = new Date();
  next();
});

TodoSchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb);
  }

};

module.exports = mongoose.model('Todo', TodoSchema);
