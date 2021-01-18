const mongoose = require("mongoose");
const graphql = require("graphql");

const { GraphQLJSON } = require("graphql-type-json");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} = graphql;
const Workout_Type = require("./Workout_Type");
const Routine_Type = require("./Routine_Type");
const WorkoutSet_Type = require("./WorkoutSet_Type");
const Badge_Type = require("./Badge_Type");
const Level_Type = require("./Level_Type");
const User = mongoose.model("User");
const Level = mongoose.model("Level");

const User_Type = new GraphQLObjectType({
  name: "User",

  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },

    googleId: { type: GraphQLString },
    picture: { type: GraphQLString },

    token: { type: GraphQLString },
    loggedIn: { type: GraphQLBoolean },
    value: { type: GraphQLJSON },

    workouts: {
      type: GraphQLList(Workout_Type),
      resolve(parentValue) {
        return User.findById(parentValue.id)
          .populate("workouts")
          .then((user) => user.workouts);
      },
    },

    routinesFollowing: {
      type: GraphQLList(Routine_Type),
      resolve(parentValue) {
        return User.findById(parentValue.id)
          .populate("routinesFollowing")
          .then((user) => user.routinesFollowing);
      },
    },

    routinesAuthored: {
      type: GraphQLList(Routine_Type),
      resolve(parentValue) {
        return User.findById(parentValue.id)
          .populate("routinesAuthored")
          .then((user) => user.routinesAuthored);
      },
    },

    workoutSets: {
      type: GraphQLList(WorkoutSet_Type),
      resolve(parentValue) {
        return User.findById(parentValue.id)
          .populate("workoutSets")
          .then((user) => user.workoutSets);
      },
    },

    xp: { type: GraphQLInt },

    level: {
      type: Level_Type,
      resolve(parentValue) {
        return Level.findById(parentValue.level)
          .then((level) => level)
          .catch((err) => null);
      },
    },

    badges: {
      type: GraphQLList(Badge_Type),
      resolve(parentValue) {
        return User.findById(parentValue.id)
          .populate("badges")
          .then((user) => user.badges);
      },
    },
    summaryStatistics: { type: GraphQLJSON },

    xpHeatMap: { type: GraphQLJSON },

    totalPounds: { type: GraphQLInt },
    totalWorkouts: { type: GraphQLJSON },
    topExercises: { type: GraphQLJSON },
    isFeatured: { type: GraphQLBoolean },
  }),
});

module.exports = User_Type;
