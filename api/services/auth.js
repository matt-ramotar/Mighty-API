const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");

const keys = process.env.SECRET_OR_KEY;

const validateSignupInput = require("../../validation/signup");
const validateLoginInput = require("../../validation/login");

const signup = async (data) => {
  try {
    const { message, isValid } = validateSignupInput(data);

    if (!isValid) throw new Error(message);

    const { firstName, lastName, username, email, password } = data;

    const emailAlreadyExists = await User.findOne({ email });

    const usernameAlreadyExists = await User.findOne({ username });

    if (emailAlreadyExists && usernameAlreadyExists)
      throw new Error("Email address and username are already in use.");

    if (emailAlreadyExists) throw new Error("Email address already exists.");

    if (usernameAlreadyExists) throw new Error("Username already exists");

    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      xp: 0,
      level: "5fd966a2c6475b803a702995",
      isFeatured: false,
      summaryStatistics: {},
      xpHeatMap: {},
      totalPounds: 0,
      topExercises: {},
      totalWorkouts: {
        2021: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        _count: 0,
        _chain: [],
      },
    });

    user.save();

    const token = jwt.sign({ id: user._id }, keys);

    return {
      token,
      id: user.id,
      isFeatured: user.isFeatured,
      level: user.level,
      picture: user.picture,
      summaryStatistics: user.summaryStatistics,
      topExercises: user.topExercises,
      totalPounds: user.totalPounds,
      totalWorkouts: user.totalWorkouts,
      xp: user.xp,
      xpHeatMap: user.xpHeatMap,
      firstName,
      lastName,
      username,
      email,
    };
  } catch (err) {
    throw err;
  }
};

const login = async (data) => {
  try {
    const { message, isValid } = validateLoginInput(data);
    if (!isValid) throw new Error(message);

    const { email, password } = data;

    const user = await User.findOne({ email });

    if (!user) throw new Error("There are no users with that email address");

    const isValidPassword = await bcrypt.compareSync(password, user.password);

    if (!isValidPassword) throw new Error("Invalid password");

    const token = jwt.sign({ id: user.id }, keys);
    return { token, loggedIn: true, ...user._doc, password: null, id: user.id };
  } catch (err) {
    throw err;
  }
};

const loginDemoUser = async (data) => {
  const user = await User.findById("5fa0b272063373b520858697");

  const token = jwt.sign({ id: user.id }, keys);
  return { token, loggedIn: true, ...user._doc, password: null, id: user.id };
};

const logout = async (data) => {
  try {
    const { _id } = data;

    const user = await User.findById(_id);

    if (!user) throw new Error("This user does not exist");

    const token = "";

    return { token, loggedIn: false, ...user._doc, password: null };
  } catch (err) {
    throw err;
  }
};

const verifyUser = async (data) => {
  try {
    const { token } = data;

    const decoded = jwt.verify(token, keys);

    const { id } = decoded;

    const loggedIn = await User.findById(id).then((user) =>
      user ? true : false
    );

    return { loggedIn, id };
  } catch (err) {
    return { loggedIn: false };
  }
};

const validateToken = async ({ token }) => {
  try {
    const { id } = jwt.verify(token, keys);

    const user = await User.findById(id);

    if (user) return user;
  } catch (err) {
    return { loggedIn: false, value: { err } };
  }
};

const upsertGoogleUser = async (data) => {
  try {
    const { firstName, lastName, email, password, googleId, picture } = data;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        firstName,
        lastName,
        email,
        password,
        googleId,
        picture,
      });
      await user.save();
    }

    const token = jwt.sign({ id: user.id }, keys);

    return { token, loggedIn: true, ...user._doc, id: user.id };
  } catch (err) {
    return { loggedIn: false };
  }
};

module.exports = {
  signup,
  login,
  loginDemoUser,
  logout,
  verifyUser,
  validateToken,
  upsertGoogleUser,
};
