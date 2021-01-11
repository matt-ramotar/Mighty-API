const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  graphic: { type: String },
  description: { type: String },
});

module.exports = mongoose.model('Badge', BadgeSchema);
