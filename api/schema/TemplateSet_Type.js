const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = graphql;
const Exercise_Type = require('./Exercise_Type');
const { Exercise, TemplateSet } = require('../models');

const TemplateSet_Type = new GraphQLObjectType({
  name: 'TemplateSet',
  fields: () => ({
    id: { type: GraphQLID },
    reps: { type: GraphQLInt },
    exercise: {
      type: Exercise_Type,

      resolve(parentValue) {
        return Exercise.findById(parentValue.exercise)
          .then(exercise => exercise)
          .catch(err => null);
      },
    },
  }),
});

module.exports = TemplateSet_Type;
