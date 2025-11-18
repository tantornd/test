const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    transactionDate: {
      type: Date,
      required: [true, "Please add a transaction date"],
      default: Date.now,
    },
    transactionType: {
      type: String,
      required: [true, "Please specify transaction type"],
      enum: ["stockIn", "stockOut"],
      default: "stockIn",
    },
    itemAmount: {
      type: Number,
      required: [true, "Please add item amount"],
      min: [1, "Item amount must be at least 1"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Validate stock-out amount limit for staff users
RequestSchema.pre("save", async function (next) {
  if (this.transactionType === "stockOut" && this.itemAmount > 50) {
    return next(new Error("Stock-out amount cannot exceed 50 items"));
  }
  next();
});

// Reverse populate with virtuals
RequestSchema.virtual("userInfo", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
});

RequestSchema.virtual("productInfo", {
  ref: "Product",
  localField: "product_id",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Request", RequestSchema);
