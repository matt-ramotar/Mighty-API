const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const InstructionSchema = new Schema({
  instruction: { type: String, required: true },
});

module.exports = mongoose.model('Instruction', InstructionSchema);
