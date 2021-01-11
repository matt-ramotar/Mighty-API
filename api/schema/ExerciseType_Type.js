const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const ExerciseType = mongoose.model('ExerciseType');

const ExerciseTypeType = new GraphQLObjectType({
  name: 'ExerciseType',

  fields: () => ({
    id: { type: GraphQLID },
    type: { type: GraphQLString },

    // Requiring Exercise_Type here to overcome circular dependencies
    exercises: {
      type: new GraphQLList(require('./Exercise_Type')),
      resolve(parentValue) {
        // parentValue is ExerciseType we are performing query on
        return ExerciseType.findById(parentValue.id)
          .populate('exercises')
          .then(exerciseType => exerciseType.exercises);
      },
    },
  }),
});

module.exports = ExerciseTypeType;
