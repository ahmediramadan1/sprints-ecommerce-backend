const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const Product = require("./productModel");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
    minlength: [2, "Name must be equal to or more than 2 characters"],
    capitalize: true,
  },

  role: {
    type: String,
    enum: ["admin", "seller", "customer"],
    default: "customer",
  },

  email: {
    type: String,
    required: [true, "Please enter your email!"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email!"],
  },

  password: {
    type: String,
    required: [true, "You must enter a password!"],
    minlength: [8, "Password must be equal to or more than 8 characters"],
    select: false,
  },

  passwordRepeat: {
    type: String,
    required: [true, "You must confirm your password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords don't match!",
    },
  },

  passwordChangedAt: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  purchasedProducts: {
    type: [String],
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordRepeat = undefined;
    next();
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  } else {
    this.passwordChangedAt = Date.now() - 1000;
    next();
  }
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPassword = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
