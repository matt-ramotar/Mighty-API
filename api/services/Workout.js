const mongoose = require('mongoose');
const User = mongoose.model('User');
const Workout = mongoose.model('Workout');
const WorkoutSet = mongoose.model('WorkoutSet');
const Exercise = mongoose.model('Exercise');

const createWorkout = async data => {
  try {
    const { userId, routineId, start } = data;

    const workout = await Workout.create({ user: userId, routine: routineId, start });

    const user = await User.findById(userId);

    if (!user) throw new Error('There is no user with that ID');

    user.workouts.push(workout);

    const year = start.getYear() - 100 + 2000;
    const month = start.getMonth() + 1;

    user.totalWorkouts[year][month] = user.totalWorkouts[year][month] + 1;
    user.totalWorkouts._count = user.totalWorkouts._count + 1;

    user.markModified('totalWorkouts');

    await user.save();

    return { id: workout.id };
  } catch (err) {
    throw err;
  }
};

const finishWorkout = async data => {
  const { workoutId, end } = data;

  const workout = await Workout.findById(workoutId);
  workout.end = end;
  await workout.save();

  return {
    id: workout.id,
    start: workout.start,
    end: workout.end,
    sets: workout.sets,
    personalRecords: workout.personalRecords,
  };
};

module.exports = { createWorkout, finishWorkout };
