const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const Muscle = mongoose.model('Muscle');

const Muscle_Type = new GraphQLObjectType({
  name: 'Muscle',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },

    exercises: {
      type: new GraphQLList(require('./Exercise_Type')),
      resolve(parentValue) {
        return Muscle.findById(parentValue.id)
          .populate('exercises')
          .then(muscle => muscle.exercises);
      },
    },
  }),
});

module.exports = Muscle_Type;
