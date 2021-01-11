const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const Badge_Type = new GraphQLObjectType({
  name: 'Badge',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    graphic: { type: GraphQLString },
  }),
});

module.exports = Badge_Type;
