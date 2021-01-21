const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLJSON } = require("graphql-type-json");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} = graphql;

const ExerciseType_Type = require("./ExerciseType_Type");
const Equipment_Type = require("./Equipment_Type");
const Instruction_Type = require("./Instruction_Type");
const Muscle_Type = require("./Muscle_Type");

const Exercise = mongoose.model("Exercise");
const ExerciseType = mongoose.model("ExerciseType");
const Equipment = mongoose.model("Equipment");

const Exercise_Type = new GraphQLObjectType({
  name: "Exercise",
  // Wrapped in a function to create a thunk
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    bbPageUrl: { type: GraphQLString },
    exerciseType: {
      type: ExerciseType_Type,
      resolve(parentValue) {
        return ExerciseType.findById(parentValue.exerciseType)
          .then((exerciseType) => exerciseType)
          .catch((err) => null);
      },
    },
    equipment: {
      type: Equipment_Type,
      resolve(parentValue) {
        return Equipment.findById(parentValue.equipment)
          .then((equipment) => equipment)
          .catch((err) => null);
      },
    },

    instructions: {
      type: new GraphQLList(Instruction_Type),
      resolve(parentValue) {
        return Exercise.findById(parentValue.id)
          .populate("instructions")
          .then((exercise) => exercise.instructions);
      },
    },

    muscles: {
      type: new GraphQLList(Muscle_Type),
      resolve(parentValue) {
        return Exercise.findById(parentValue.id)
          .populate("muscles")
          .then((exercise) => exercise.muscles);
      },
    },

    xp: { type: GraphQLInt },

    summaryStatistics: { type: GraphQLJSON },
    isFeatured: { type: GraphQLBoolean },
    isIncluded: { type: GraphQLBoolean },
  }),
});

module.exports = Exercise_Type;
