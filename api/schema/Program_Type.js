const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLBoolean } = graphql;

const Routine_Type = require('./Routine_Type');
const Program = mongoose.model('Program');

const Program_Type = new GraphQLObjectType({
  name: 'Program',

  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    routines: {
      type: new GraphQLList(Routine_Type),
      resolve(parentValue) {
        return Program.findById(parentValue.id)
          .populate('routines')
          .then(program => program.routines);
      },
    },

    isFeatured: { type: GraphQLBoolean },
  }),
});

module.exports = Program_Type;
