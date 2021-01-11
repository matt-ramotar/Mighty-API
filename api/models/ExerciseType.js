const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const ExerciseTypeSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ExerciseType', ExerciseTypeSchema);
