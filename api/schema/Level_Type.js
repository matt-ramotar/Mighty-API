const mongoose = require("mongoose");
const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
} = graphql;

const Level_Type = new GraphQLObjectType({
  name: "Level",
  fields: () => ({
    id: { type: GraphQLID },
    number: { type: GraphQLInt },
    graphic: { type: GraphQLString },
    minXP: { type: GraphQLInt },
    maxXP: { type: GraphQLInt },
  }),
});

module.exports = Level_Type;
