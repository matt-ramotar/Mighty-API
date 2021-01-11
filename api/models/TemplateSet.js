const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const TemplateSetSchema = new Schema({
  reps: { type: Number },
  routine: { type: Schema.Types.ObjectId, ref: 'Routine' },
  exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
});

module.exports = mongoose.model('TemplateSet', TemplateSetSchema);
