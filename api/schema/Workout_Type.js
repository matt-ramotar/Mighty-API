const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const { GraphQLJSON } = require('graphql-type-json');

const WorkoutSet_Type = require('./WorkoutSet_Type');

const Workout = mongoose.model('Workout');

const Workout_Type = new GraphQLObjectType({
  name: 'Workout',

  fields: () => ({
    id: { type: GraphQLID },

    start: { type: GraphQLDateTime },
    end: { type: GraphQLDateTime },

    personalRecords: { type: GraphQLJSON },

    sets: {
      type: GraphQLList(WorkoutSet_Type),
      resolve(parentValue) {
        return Workout.findById(parentValue.id)
          .populate('sets')
          .then(workout => workout.sets);
      },
    },
  }),
});

module.exports = Workout_Type;
