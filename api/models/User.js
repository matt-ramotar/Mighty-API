const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    password: { type: String },

    googleId: { type: String },
    picture: { type: String },

    workouts: [{ type: Schema.Types.ObjectId, ref: 'Workout' }],
    workoutSets: [{ type: Schema.Types.ObjectId, ref: 'WorkoutSet' }],

    routinesFollowing: [{ type: Schema.Types.ObjectId, ref: 'Routine' }],

    routinesAuthored: [{ type: Schema.Types.ObjectId, ref: 'Routine' }],

    xp: { type: Number },
    level: { type: Schema.Types.ObjectId, ref: 'Level' },
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],

    summaryStatistics: { type: Schema.Types.Mixed },
    topExercises: { type: Schema.Types.Mixed },

    totalPounds: { type: Number },
    totalWorkouts: { type: Schema.Types.Mixed },
    isFeatured: { type: Boolean },
  },
  { minimize: false }
);

UserSchema.pre('save', function (next) {
  const user = this;

  // Only hash the password if it is new or has been modified
  if (!user.isModified('password')) return next();

  // Generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // Hash the password using new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // Override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre('save', function (next) {
  const user = this;

  const topExercises = user.getTopExercises();

  user.topExercises = topExercises;

  next();
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    cb(null, isMatch);
  });
};

UserSchema.methods.getTopExercises = function () {
  const exercisesArray = [];
  let exercisesQue = [];

  const labels = [];
  const data = [];

  let counter = 1;
  let otherCount = 0;

  for (const [exercise, stats] of Object.entries(this.summaryStatistics)) {
    exercisesArray.push([stats._count, exercise]);
  }

  exercisesQue = exercisesArray.sort((a, b) => a - b);

  while (exercisesQue.length > 0) {
    const [count, exercise] = exercisesQue.shift();

    if (counter >= 6) {
      otherCount = otherCount + count;
      counter++;
      continue;
    }

    labels.push(exercise);
    data.push(count);
    counter++;
  }

  labels.push('Other');
  data.push(otherCount);

  return { labels, data };
};

module.exports = mongoose.model('User', UserSchema);
