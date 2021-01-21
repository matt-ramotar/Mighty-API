const mongoose = require("mongoose");
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;
const { GraphQLJSON } = require("graphql-type-json");

const Author_Type = require("./Author_Type");
const Equipment_Type = require("./Equipment_Type");
const Exercise_Type = require("./Exercise_Type");
const ExerciseType_Type = require("./ExerciseType_Type");
const Instruction_Type = require("./Instruction_Type");
const Muscle_Type = require("./Muscle_Type");
const User_Type = require("./User_Type");
const Program_Type = require("./Program_Type");
const Routine_Type = require("./Routine_Type");
const Workout_Type = require("./Workout_Type");
const Level_Type = require("./Level_Type");
const WorkoutSet_Type = require("./WorkoutSet_Type");

const Author = mongoose.model("Author");
const Exercise = mongoose.model("Exercise");
const ExerciseType = mongoose.model("ExerciseType");
const Equipment = mongoose.model("Equipment");
const Instruction = mongoose.model("Instruction");
const Muscle = mongoose.model("Muscle");
const User = mongoose.model("User");
const Program = mongoose.model("Program");
const Routine = mongoose.model("Routine");
const Workout = mongoose.model("Workout");
const Level = mongoose.model("Level");
const WorkoutSet = mongoose.model("WorkoutSet");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: () => ({
    exercises: {
      type: new GraphQLList(Exercise_Type),
      args: {
        featured: { type: GraphQLBoolean },
        muscle: { type: GraphQLString },
      },
      resolve(parentValue, { featured, muscle }) {
        console.log(featured, muscle);
        if (featured && muscle)
          return Exercise.find({
            isFeatured: true,
            muscles: mongoose.Types.ObjectId(muscle),
          });

        if (featured) return Exercise.find({ isFeatured: true });

        if (muscle)
          return Exercise.find({
            muscles: mongoose.Types.ObjectId(muscle),
            isIncluded: true,
          });

        return Exercise.find({ isIncluded: true });
      },
    },
    exercise: {
      type: Exercise_Type,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Exercise.findById(id);
      },
    },

    exerciseType: {
      type: ExerciseType_Type,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return ExerciseType.findById(id);
      },
    },

    exerciseTypes: {
      type: new GraphQLList(ExerciseType_Type),
      resolve() {
        return ExerciseType.find({});
      },
    },

    equipment: {
      type: new GraphQLList(Equipment_Type),
      resolve() {
        return Equipment.find({});
      },
    },

    instructions: {
      type: new GraphQLList(Instruction_Type),
      resolve() {
        return Instruction.find({});
      },
    },

    muscles: {
      type: new GraphQLList(Muscle_Type),
      resolve() {
        return Muscle.find({});
      },
    },

    users: {
      type: new GraphQLList(User_Type),
      args: {
        featured: { type: GraphQLBoolean },
        top10: { type: GraphQLString },
      },
      async resolve(parentValue, { featured, top10 }) {
        if (featured) return User.find({ isFeatured: true });

        if (top10 === "XP") {
          const topUsers = await User.find({}).sort({ xp: -1 }).limit(10);
          const featuredUsers = await User.find({ isFeatured: true });
          console.log("featured users", featuredUsers);
          return [...featuredUsers, ...topUsers];
        }

        return User.find({});
      },
    },

    user: {
      type: User_Type,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return User.findById(id);
      },
    },

    programs: {
      type: new GraphQLList(Program_Type),
      args: { featured: { type: GraphQLBoolean } },
      resolve(parentValue, { featured }) {
        if (featured === undefined) return Program.find({});
        return Program.find({ isFeatured: true });
      },
    },

    program: {
      type: Program_Type,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Program.findById(id);
      },
    },

    routines: {
      type: new GraphQLList(Routine_Type),
      args: { where: { type: GraphQLJSON } },
      resolve(parentValue, { where }) {
        if (where) return Routine.find({ where });
        return Routine.find({});
      },
    },

    routine: {
      type: Routine_Type,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Routine.findById(id);
      },
    },

    workouts: {
      type: new GraphQLList(Workout_Type),
      resolve() {
        return Workout.find({});
      },
    },

    workout: {
      type: Workout_Type,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Workout.findById(id);
      },
    },

    workoutSet: {
      type: WorkoutSet_Type,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return WorkoutSet.findById(id);
      },
    },

    workoutSets: {
      type: new GraphQLList(WorkoutSet_Type),
      resolve() {
        return WorkoutSet.find({});
      },
    },

    authors: {
      type: new GraphQLList(Author_Type),
      resolve() {
        return Author.find({});
      },
    },

    author: {
      type: Author_Type,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Author.findById(id);
      },
    },

    levels: {
      type: new GraphQLList(Level_Type),
      resolve() {
        return Level.find({});
      },
    },

    level: {
      type: Level_Type,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Level.findById(id);
      },
    },
  }),
});

module.exports = RootQuery;
