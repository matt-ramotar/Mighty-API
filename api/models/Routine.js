const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const RoutineSchema = new Schema({
  program: { type: Schema.Types.ObjectId, ref: 'Program' },
  templateSets: [{ type: Schema.Types.ObjectId, ref: 'TemplateSet' }],
  workouts: [{ type: Schema.Types.ObjectId, ref: 'Workout' }],
  name: { type: String },
  rating: { type: Number },
  targetTime: { type: Number },
  xp: { type: Number },
  description: { type: String },
  picture: { type: String },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  author__mighty: { type: Schema.Types.ObjectId, ref: 'Author' },
  author__user: { type: Schema.Types.ObjectId, ref: 'User' },
  isFeatured: { type: Boolean },
});

module.exports = mongoose.model('Routine', RoutineSchema);
