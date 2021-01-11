const graphql = require("graphql");
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
} = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } = graphql;

const AuthService = require("./services/auth");
const RoutineService = require("./services/Routine");
const UserService = require("./services/User");
const WorkoutService = require("./services/Workout");
const WorkoutSetService = require("./services/WorkoutSet");

const User_Type = require("./schema/User_Type");
const Routine_Type = require("./schema/Routine_Type");
const Workout_Type = require("./schema/Workout_Type");
const WorkoutSet_Type = require("./schema/WorkoutSet_Type");

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: User_Type,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(_, args) {
        return AuthService.signup(args);
      },
    },

    login: {
      type: User_Type,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(_, args) {
        return AuthService.login(args);
      },
    },

    loginDemoUser: {
      type: User_Type,
      resolve(_, args) {
        return AuthService.loginDemoUser();
      },
    },

    logout: {
      type: User_Type,
      args: {
        _id: { type: GraphQLID },
      },
      resolve(_, args) {
        return AuthService.logout(args);
      },
    },

    verifyUser: {
      type: User_Type,
      args: {
        token: { type: GraphQLString },
      },
      resolve(_, args) {
        return AuthService.verifyUser(args);
      },
    },

    validateToken: {
      type: User_Type,
      args: {
        token: { type: GraphQLString },
      },
      resolve(_, args) {
        return AuthService.validateToken(args);
      },
    },

    upsertGoogleUser: {
      type: User_Type,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        googleId: { type: GraphQLString },
        picture: { type: GraphQLString },
      },
      resolve(_, args) {
        return AuthService.upsertGoogleUser(args);
      },
    },
    saveRoutine: {
      type: Routine_Type,
      args: {
        userId: { type: GraphQLID },
        routineId: { type: GraphQLID },
      },
      resolve(_, args) {
        return RoutineService.saveRoutine(args);
      },
    },

    createRoutine: {
      type: Routine_Type,
      args: {
        name: { type: GraphQLString },
        targetTime: { type: GraphQLInt },
        xp: { type: GraphQLInt },
        description: { type: GraphQLString },
        author: { type: GraphQLID },
        exercisesObject: { type: GraphQLString },
      },
      resolve(_, args) {
        return RoutineService.createRoutine(args);
      },
    },

    createWorkout: {
      type: Workout_Type,
      args: {
        userId: { type: GraphQLID },
        routineId: { type: GraphQLID },
        start: { type: GraphQLDateTime },
      },
      resolve(_, args) {
        return WorkoutService.createWorkout(args);
      },
    },

    createWorkoutSet: {
      type: WorkoutSet_Type,
      args: {
        reps: { type: GraphQLInt },
        pounds: { type: GraphQLInt },
        exerciseId: { type: GraphQLID },
        userId: { type: GraphQLID },
        workoutId: { type: GraphQLID },
      },
      resolve(_, args) {
        return WorkoutSetService.createWorkoutSet(args);
      },
    },

    updateXP: {
      type: User_Type,
      args: {
        xp: { type: GraphQLInt },
        userId: { type: GraphQLID },
      },
      resolve(_, args) {
        return UserService.updateXP(args);
      },
    },

    finishWorkout: {
      type: Workout_Type,
      args: {
        workoutId: { type: GraphQLID },
        end: { type: GraphQLDateTime },
      },
      resolve(_, args) {
        return WorkoutService.finishWorkout(args);
      },
    },
  },
});

module.exports = mutation;
