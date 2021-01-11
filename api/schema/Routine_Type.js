const mongoose = require('mongoose');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLBoolean } = graphql;
const { GraphQLJSON } = require('graphql-type-json');

const Workout_Type = require('./Workout_Type');
const TemplateSet_Type = require('./TemplateSet_Type');
const User_Type = require('./User_Type');
const Author_Type = require('./Author_Type');

const Routine = mongoose.model('Routine');
const Author = mongoose.model('Author');
const User = mongoose.model('User');

const Routine_Type = new GraphQLObjectType({
  name: 'Routine',

  fields: () => ({
    id: { type: GraphQLID },

    templateSets: {
      type: new GraphQLList(TemplateSet_Type),
      resolve(parentValue) {
        return Routine.findById(parentValue.id)
          .populate('templateSets')
          .then(routine => routine.templateSets);
      },
    },
    workouts: {
      type: new GraphQLList(Workout_Type),
      resolve(parentValue) {
        return Routine.findById(parentValue.id)
          .populate('workouts')
          .then(routine => routine.workouts);
      },
    },

    name: { type: GraphQLString },
    rating: { type: GraphQLFloat },
    targetTime: { type: GraphQLInt },
    xp: { type: GraphQLInt },
    description: { type: GraphQLString },
    picture: { type: GraphQLString },
    users: {
      type: GraphQLInt,
      resolve(parentValue) {
        return Routine.findById(parentValue.id)
          .populate('users')
          .then(routine => routine.users.length);
      },
    },
    author__mighty: {
      type: Author_Type,
      resolve(parentValue) {
        Author.findById(parentValue.author__mighty)
          .then(author => author)
          .catch(err => null);
      },
    },

    author__user: {
      type: GraphQLString,
      resolve(parentValue) {
        User.findById(parentValue.author__user)
          .then(user => user.firstName)
          .catch(err => {
            console.log('error', err);
          });
      },
    },

    isFeatured: { type: GraphQLBoolean },
  }),
});

module.exports = Routine_Type;
