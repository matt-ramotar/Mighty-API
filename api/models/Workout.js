const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  routine: { type: Schema.Types.ObjectId, ref: 'Routine' },
  start: { type: Date, required: true, default: Date.now() },
  end: { type: Date },
  sets: [{ type: Schema.Types.ObjectId, ref: 'WorkoutSet' }],
  personalRecords: [],
});

module.exports = mongoose.model('Workout', WorkoutSchema);
