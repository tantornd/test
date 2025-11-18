const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      unique: true,
      trim: true,
      maxlength: [100, "Product name cannot be more than 100 characters"],
    },
    sku: {
      type: String,
      required: [true, "Please add a SKU"],
      unique: true,
      trim: true,
      maxlength: [50, "SKU cannot be more than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a product description"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Please add a product category"],
      trim: true,
      maxlength: [50, "Category cannot be more than 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a product price"],
      min: [0, "Price cannot be negative"],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Please add stock quantity"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, "Please add a unit of measurement"],
      trim: true,
      maxlength: [20, "Unit cannot be more than 20 characters"],
    },
    picture: {
      type: String,
      required: [true, "Please add URL to product picture"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals for requests
ProductSchema.virtual("requests", {
  ref: "Request",
  localField: "_id",
  foreignField: "product_id",
  justOne: false,
});

module.exports = mongoose.model("Product", ProductSchema);
