const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const Author_Type = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    picture: { type: GraphQLString },
    // followers: {
    //   type: new GraphQLList(User_Type),
    //   resolve(parentValue) {
    //     return Author.findById(parentValue.id)
    //       .populate('followers')
    //       .then(author => author.followers);
    //   },
    // },
    // routines: {
    //   type: new GraphQLList(Routine_Type),
    //   resolve(parentValue) {
    //     return Author.findById(parentValue.id)
    //       .populate('routines')
    //       .then(author => author.routines);
    //   },
    // },
  }),
});

module.exports = Author_Type;
