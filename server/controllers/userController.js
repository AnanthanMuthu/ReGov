const asyncHandler = require("express-async-handler");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
const User = require("../models/userModel.js");
const generateToken = require("../utils/generateToken.js");
const nodemailerConfig = require("../config/nodemailerConfig");
const { default: isEmpty } = require("../validations/isEmpty.js");

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.status != "Active") {
      res.status(403);
      throw new Error("Pending Account. Please Verify Your Email!");
    }

    return res.json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      status: user.status,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, retypePassword } = req.body;
  const userExists = await User.findOne({ email });
  const errors = {};

  if (userExists) {
    errors.email = "User with this email already exists";
  }

  if (!fullname) {
    errors.fullname = "Fullname is required";
  }
  if (!email) {
    errors.email = "Email is required";
  }
  if (!password) {
    errors.password = "Password is required";
  }
  if (!retypePassword) {
    errors.retypePassword = "Retype password is required";
  }
  if (password && retypePassword) {
    if (password !== retypePassword) {
      errors.retypePassword = "Password not the same";
    }
  }

  if (!isEmpty(errors)) {
    res.status(400);

    return res.json({ type: "FORM_ERROR", errors: errors });
  }
  const user = await User.create({
    fullname,
    email,
    password,
  });
  const confirmationCode =
    crypto.randomBytes(5).toString("hex") +
    user._id.toString() +
    crypto.randomBytes(5).toString("hex");
  if (user) {
    user.confirmationCode = confirmationCode;
    await user.save();
    nodemailerConfig.sendConfirmationEmail(
      user.fullname,
      user.email,
      user.confirmationCode
    );

    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      status: user.status,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { password, retypePassword } = req.body;
  const userExists = await User.findOne({ email });
  const errors = {};

  if (!password) {
    errors.password = "Password is required";
  }
  if (!retypePassword) {
    errors.retypePassword = "Retype password is required";
  }
  if (password && retypePassword) {
    if (password !== retypePassword) {
      errors.retypePassword = "Password not the same";
    }
  }

  if (!isEmpty(errors)) {
    res.status(400);

    return res.json({ type: "FORM_ERROR", errors: errors });
  }
  const user = {
    password,
  };
  if (user) {
    await user.save();

    res.status(201).json({
      message: "Password reset done successfully!",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const forgotPasswordLink = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("### userExists", email);
  const user = await User.findOne({ email });
  console.log("### userExists 2", user);
  const errors = {};
  if (user) {
    const confirmationCode =
      crypto.randomBytes(5).toString("hex") +
      user?._id?.toString() +
      crypto.randomBytes(5).toString("hex");
    console.log("### confirmationCode", confirmationCode);
    user.status = "Pending";
    user.confirmationCode = confirmationCode;
    await user.save();

    user.confirmationCode = confirmationCode;
    nodemailerConfig.sendPasswordResetLinkEmail(
      user.fullname,
      email,
      user.confirmationCode
    );
    res.status(201).json({
      status: "Reset link has been sent to your mail id.",
    });
  } else {
    res.status(400);
    throw new Error("Email id is not registered with us!");
  }
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const confirmationCode =
      crypto.randomBytes(5).toString("hex") +
      user._id.toString() +
      crypto.randomBytes(5).toString("hex");

    if (user.status != "Active") {
      user.confirmationCode = confirmationCode;
      await user.save();

      if (user) {
        nodemailerConfig.sendConfirmationEmail(
          user.fullname,
          user.email,
          user.confirmationCode
        );

        res.status(202);
        return res.json({
          message: "Verification code sent successfully",
        });
      } else {
        res.status(404);
        throw new Error("User with this email doesn't exist");
      }
    } else if (userEmail.status == "Active") {
      res.status(202);
      return res.json({
        message: "User account is already activated",
      });
    } else {
      res.status(404);
      throw new Error("User with this email doesn't exist");
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    confirmationCode: req.params.confirmationCode,
  });

  if (!user) {
    res.status(404);
    throw new Error("User Not found. Confirmation code is expired.");
  }
  if (user.status == "Active") {
    res.status(201);
    return res.json({
      message: "User account already activated please login to continue",
    });
  }

  user.status = "Active";

  user.save((err) => {
    if (err) {
      res.status(500);
      throw new Error(err);
    } else {
      res.status(200);
      return res.json({
        message: "User account successfully activated please login to continue",
      });
    }
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    confirmationCode: req.params.confirmationCode,
  });

  if (!user) {
    res.status(404);
    throw new Error("User Not found. Confirmation code is expired.");
  }
  if (user.status == "Active") {
    res.status(201);
    return res.json({
      message: "Please enter the new password to reset.",
    });
  }
});

module.exports = {
  loginUser,
  registerUser,
  forgotPasswordLink,
  verifyUser,
  resetPassword,
  updatePassword,
  resendVerificationEmail,
};
