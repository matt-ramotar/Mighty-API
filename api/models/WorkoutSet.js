const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const WorkoutSetSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  reps: { type: Number },
  pounds: { type: Number },
  workout: { type: Schema.Types.ObjectId, ref: 'Workout' },
  exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
  timestamp: { type: Date, default: Date.now() },
  personalRecords: { type: Schema.Types.Mixed },
});

module.exports = mongoose.model('WorkoutSet', WorkoutSetSchema);
