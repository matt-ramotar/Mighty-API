const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const LevelSchema = new Schema({
  number: { type: Number },
  graphic: { type: String },
});

module.exports = mongoose.model('Level', LevelSchema);
