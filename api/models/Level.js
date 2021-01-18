const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const Schema = mongoose.Schema;

const LevelSchema = new Schema({
  number: { type: Number },
  graphic: { type: String },
  minXP: { type: Number },
  maxXP: { type: Number },
});

module.exports = mongoose.model("Level", LevelSchema);
