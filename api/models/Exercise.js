const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bbPageUrl: {
    type: String,
  },
  exerciseType: {
    type: Schema.Types.ObjectId,
    ref: 'ExerciseType',
  },
  equipment: {
    type: Schema.Types.ObjectId,
    ref: 'Equipment',
  },
  instructions: [{ type: Schema.Types.ObjectId, ref: 'Instruction' }],
  muscles: [{ type: Schema.Types.ObjectId, ref: 'Muscle' }],

  xp: { type: Number },

  summaryStatistics: { type: Schema.Types.Mixed },
  isFeatured: { type: Boolean },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
