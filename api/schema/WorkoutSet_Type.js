const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLBoolean } = graphql;
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');
const { GraphQLJSON } = require('graphql-type-json');

const User_Type = require('./User_Type');
const Exercise_Type = require('./Exercise_Type');
const WorkoutSet = mongoose.model('WorkoutSet');
const User = mongoose.model('User');
const Exercise = mongoose.model('Exercise');

const WorkoutSet_Type = new GraphQLObjectType({
  name: 'WorkoutSet',
  fields: () => ({
    id: { type: GraphQLID },
    reps: { type: GraphQLInt },
    pounds: { type: GraphQLInt },

    // user: {
    //   type: User_Type,

    //   resolve(parentValue) {
    //     return User.findById(parentValue.user)
    //       .then(user => user)
    //       .catch(err => null);
    //   },
    // },
    exercise: {
      type: Exercise_Type,

      resolve(parentValue) {
        return Exercise.findById(parentValue.exercise)
          .then(exercise => exercise)
          .catch(err => null);
      },
    },

    timestamp: { type: GraphQLDateTime },
    personalRecords: { type: GraphQLJSON },
  }),
});

module.exports = WorkoutSet_Type;
