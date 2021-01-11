const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  picture: { type: String },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  routines: [{ type: Schema.Types.ObjectId, ref: 'Routine' }],
});

module.exports = mongoose.model('Author', AuthorSchema);
