const mongoose = require("mongoose");
const User = mongoose.model("User");
const Workout = mongoose.model("Workout");
const WorkoutSet = mongoose.model("WorkoutSet");
const Exercise = mongoose.model("Exercise");

const prefixWithZeroIfSingleDigit = (integer) => {
  return integer < 10 ? `0${integer}` : `${integer}`;
};

const createWorkoutSet = async (data) => {
  try {
    const { reps, pounds, exerciseId, userId, workoutId } = data;

    const today = new Date();
    const year = today.getYear() - 100 + 2000;
    const month = today.getMonth() + 1;
    const dayOfMonth = today.getDate();

    const todayString = `${year}-${prefixWithZeroIfSingleDigit(
      month
    )}-${prefixWithZeroIfSingleDigit(dayOfMonth)}`;

    const workoutSet = new WorkoutSet({
      reps,
      pounds,
      workout: workoutId,
      exercise: exerciseId,
      user: userId,
    });

    const user = await User.findById(userId);
    await user.workoutSets.push(workoutSet);

    user.markModified("workoutSets");

    // Total # of pounds lifted

    user.totalPounds = user.totalPounds + reps * pounds;

    // Total # of sets of exercise

    const exercise = await Exercise.findById(exerciseId);

    exercise.summaryStatistics.counts._sets += 1;
    exercise.markModified("summaryStatistics");
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

    // Update user heat map

    const nextXPHeatMap = user.xpHeatMap || {};

    const gainedXP = exercise.xp + Object.keys(personalRecords).length;

    console.log("gained xp", gainedXP);

    todayString in nextXPHeatMap
      ? (nextXPHeatMap[todayString] += gainedXP)
      : (nextXPHeatMap[todayString] = gainedXP);

    user.xpHeatMap = nextXPHeatMap;

    // Update user XP

    user.xp += gainedXP;

    // Update workoutSet gained xp

    workoutSet.gainedXP
      ? (workoutSet.gainedXP += gainedXP)
      : (workoutSet.gainedXP = gainedXP);

    user.markModified("summaryStatistics");
    user.markModified("xpHeatMap");
    await user.save();

    const workout = await Workout.findById(workoutId);
    workout.sets.push(workoutSet);
    if (Object.keys(personalRecords).length > 0) {
      workoutSet.personalRecords = personalRecords;
      workoutSet.markModified("personalRecords");

      workout.personalRecords.push(workoutSet);
    }

    await workout.save();
    await workoutSet.save();

    return workoutSet;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { createWorkoutSet };
