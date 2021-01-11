const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
  name: { type: String, required: true },
  routines: [{ type: Schema.Types.ObjectId, ref: 'Routine' }],
  isFeatured: { type: Boolean },
});

module.exports = mongoose.model('Program', ProgramSchema);
