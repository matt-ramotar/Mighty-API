const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const Instruction_Type = new GraphQLObjectType({
  name: 'Instruction',

  fields: () => ({
    id: { type: GraphQLID },
    instruction: { type: GraphQLString },
  }),
});

module.exports = Instruction_Type;
