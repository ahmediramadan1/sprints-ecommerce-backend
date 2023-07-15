const User = require("../models/userModel");
const Product = require("../models/productModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.purchase = catchAsync(async (req, res, next) => {
  const { userId, productId } = req.params;

  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("No product found!", 404));
  }

  if (user.purchasedProducts.includes(productId)) {
    return next(new AppError("Product was already purchased", 404));
  }
  user.purchasedProducts.push(productId);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateAccount = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordRepeat) {
    return next(
      new AppError(
        "This route is not for updating password! Use /updatePassword instead.",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
