const Request = require("../models/Request");
const Product = require("../models/Product");

// @desc    Get all requests (Admin only) or user's own requests (Staff)
// @route   GET /api/v1/requests
// @access  Private
exports.getRequests = async (req, res, next) => {
  try {
    let requests;
    
    // Admin can see all requests, staff can only see their own
    if (req.user.role === "admin") {
      requests = await Request.find()
        .populate("user", "name email role")
        .populate("product_id", "name sku category stockQuantity");
    } else {
      requests = await Request.find({ user: req.user.id })
        .populate("user", "name email role")
        .populate("product_id", "name sku category stockQuantity");
    }

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get request by ID
// @route   GET /api/v1/requests/:id
// @access  Private
exports.getRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("user", "name email role")
      .populate("product_id", "name sku category stockQuantity");

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Staff can only view their own requests
    if (req.user.role === "staff" && request.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view this request",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new request
// @route   POST /api/v1/requests
// @access  Private (Staff only)
exports.createRequest = async (req, res, next) => {
  try {
    // Only staff can create requests
    if (req.user.role !== "staff") {
      return res.status(403).json({
        success: false,
        error: "Only staff can create requests",
      });
    }

    // Validate stock-out amount limit
    if (req.body.transactionType === "stockOut" && req.body.itemAmount > 50) {
      return res.status(400).json({
        success: false,
        error: "Stock-out amount cannot exceed 50 items",
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(req.body.product_id);
    if (!product || !product.isActive) {
      return res.status(400).json({
        success: false,
        error: "Product not found or inactive",
      });
    }

    // For stock-out, check if sufficient stock is available
    if (req.body.transactionType === "stockOut" && product.stockQuantity < req.body.itemAmount) {
      return res.status(400).json({
        success: false,
        error: "Insufficient stock available",
      });
    }

    const request = await Request.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request
// @route   PUT /api/v1/requests/:id
// @access  Private
exports.updateRequest = async (req, res, next) => {
  try {
    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Staff can only edit their own requests
    if (req.user.role === "staff" && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to edit this request",
      });
    }

    // Validate stock-out amount limit
    if (req.body.transactionType === "stockOut" && req.body.itemAmount > 50) {
      return res.status(400).json({
        success: false,
        error: "Stock-out amount cannot exceed 50 items",
      });
    }

    request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete request
// @route   DELETE /api/v1/requests/:id
// @access  Private
exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Staff can only delete their own requests
    if (req.user.role === "staff" && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this request",
      });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel request
// @route   POST /api/v1/requests/:id/cancel
// @access  Private
exports.cancelRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Staff can only cancel their own requests
    if (req.user.role === "staff" && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to cancel this request",
      });
    }

    // Only pending requests can be cancelled
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Only pending requests can be cancelled",
      });
    }

    request.status = "cancelled";
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve request (Admin only)
// @route   POST /api/v1/requests/:id/approve
// @access  Private (Admin only)
exports.approveRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Only admin can approve requests
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Only admin can approve requests",
      });
    }

    // Only pending requests can be approved
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Only pending requests can be approved",
      });
    }

    request.status = "approved";
    request.approvedBy = req.user.id;
    request.approvedAt = Date.now();
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject request (Admin only)
// @route   POST /api/v1/requests/:id/reject
// @access  Private (Admin only)
exports.rejectRequest = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        error: "Rejection reason is required",
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Only admin can reject requests
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Only admin can reject requests",
      });
    }

    // Only pending requests can be rejected
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Only pending requests can be rejected",
      });
    }

    request.status = "rejected";
    request.rejectionReason = rejectionReason;
    request.approvedBy = req.user.id;
    request.approvedAt = Date.now();
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
