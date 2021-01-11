const mongoose = require('mongoose');

const User = mongoose.model('User');
const Routine = mongoose.model('Routine');
const TemplateSet = mongoose.model('TemplateSet');
const Exercise = mongoose.model('Exercise');

const saveRoutine = async data => {
  try {
    const { userId, routineId } = data;
    console.log(userId, routineId);

    const user = await User.findById(userId);

    if (!user) throw new Error('There is no user with that ID');

    user.routines.push(routineId);

    await user.save();

    return { saved: true };
  } catch (err) {
    throw err;
  }
};

const createRoutine = async data => {
  const { name, targetTime, xp, description, author, exercisesObject } = data;

  const routineObject = JSON.parse(exercisesObject);

  console.log('routine', routineObject);
  console.log(Object.entries(routineObject));

  const user = await User.findById(author);

  const routine = await Routine.create({ name, targetTime, xp, description, author__user: user.id });

  const templateSets = [];

  for (const [exerciseName, { exerciseId, reps, sets }] of Object.entries(routineObject)) {
    let count = 0;

    const exercise = await Exercise.findById(exerciseId);

    exercise.summaryStatistics.counts._routines += 1;

    while (count < Number.parseInt(sets)) {
      const templateSet = await TemplateSet.create({
        reps: Number.parseInt(reps),
        routine: routine.id,
        exercise: exerciseId,
      });
      templateSets.push(templateSet);
      count++;
    }

    exercise.markModified('summaryStatistics');
    await exercise.save();
  }

  routine.templateSets = templateSets;

  routine.users.push(user);

  await routine.save();

  user.routinesFollowing.push(routine);

  user.routinesAuthored.push(routine);

  await user.save();

  return { saved: true };
};

module.exports = { saveRoutine, createRoutine };
