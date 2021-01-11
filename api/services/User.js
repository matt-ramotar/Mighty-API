const mongoose = require('mongoose');
const User = mongoose.model('User');
const Workout = mongoose.model('Workout');
const WorkoutSet = mongoose.model('WorkoutSet');
const Exercise = mongoose.model('Exercise');

const newWorkout = async data => {
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

const newWorkoutSet = async data => {
  try {
    const { reps, pounds, exerciseId, userId, workoutId } = data;

    const workoutSet = await WorkoutSet.create({
      reps,
      pounds,
      workout: workoutId,
      exercise: exerciseId,
      user: userId,
    });

    const user = await User.findById(userId);
    await user.workoutSets.push(workoutSet);

    // Total # of pounds lifted

    user.totalPounds = user.totalPounds + reps * pounds;

    // Total # of sets of exercise

    const exercise = await Exercise.findById(exerciseId);

    exercise.summaryStatistics.counts._sets += 1;
    exercise.markModified('summaryStatistics');
    await exercise.save();

    const exerciseName = exercise.name;

    console.log(exerciseName);

    if (!user.summaryStatistics[exerciseName]) {
      const summaryStatistics = user.summaryStatistics;
      summaryStatistics[exerciseName] = { _count: 0 };
      user.summaryStatistics = summaryStatistics;
      await user.save();
    }

    const summaryStatistics = user.summaryStatistics;

    summaryStatistics[exerciseName]._count += 1;

    let personalRecords = {};

    // Most pounds for # of reps
    if (summaryStatistics[exerciseName][reps]) {
      if (pounds > summaryStatistics[exerciseName][reps]) {
        personalRecords = { max: [reps, pounds] };
        summaryStatistics[exerciseName][reps] = pounds;
      }
    } else {
      summaryStatistics[exerciseName][reps] = pounds;
      personalRecords = { max: [reps, pounds] };
    }

    user.summaryStatistics = summaryStatistics;

    user.markModified('summaryStatistics');
    await user.save();

    const workout = await Workout.findById(workoutId);
    workout.sets.push(workoutSet);
    if (Object.keys(personalRecords).length) {
      workoutSet.personalRecords = personalRecords;
      workoutSet.markModified('personalRecords');
      await workoutSet.save();
      workout.personalRecords.push(workoutSet);
    }

    await workout.save();
    await workoutSet.save();

    return { id: workoutSet.id, personalRecords };
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

const updateXP = async data => {
  const { xp, userId } = data;

  const user = await User.findById(userId);

  user.xp += xp;
  await user.save();
  return { id: userId, xp: user.xp };
};

module.exports = { newWorkout, newWorkoutSet, finishWorkout, updateXP };
