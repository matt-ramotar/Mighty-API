const mongoose = require("mongoose");
const graphql = require("graphql");

const { GraphQLObjectType, GraphQLID, GraphQLInt } = graphql;
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");

const Exercise_Type = require("./Exercise_Type");

const Exercise = mongoose.model("Exercise");

const WorkoutSet_Type = new GraphQLObjectType({
  name: "WorkoutSet",
  fields: () => ({
    id: { type: GraphQLID },
    reps: { type: GraphQLInt },
    pounds: { type: GraphQLInt },

    exercise: {
      type: Exercise_Type,

      resolve(parentValue) {
        return Exercise.findById(parentValue.exercise)
          .then((exercise) => exercise)
          .catch(() => null);
      },
    },

    timestamp: { type: GraphQLDateTime },
    personalRecords: { type: GraphQLJSON },
    gainedXP: { type: GraphQLInt },
  }),
});

module.exports = WorkoutSet_Type;
