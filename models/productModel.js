const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product must have a title!"],
    unique: true,
    trim: true,
    minlength: [
      3,
      "Product's title must be equal to or more than 3 characters!",
    ],
  },

  price: { type: Number, required: [true, "Product must have a price!"] },

  rating: {
    type: Number,
    min: [1, "Product's rating must be 1.0 or more"],
    max: [5, "Product's rating must be 5.0 or less"],
  },

  stock: {
    type: Number,
    required: [true, "Product must have a stock's number"],
    min: [0, "Product's stock must be 0 or more"],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
