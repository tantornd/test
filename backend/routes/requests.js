const express = require("express");
const {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
} = require("../controllers/requests");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       required:
 *         - transactionDate
 *         - transactionType
 *         - itemAmount
 *         - product_id
 *       properties:
 *         transactionDate:
 *           type: string
 *           format: date
 *           description: Transaction date
 *         transactionType:
 *           type: string
 *           enum: [stockIn, stockOut]
 *           description: Transaction type (stockIn or stockOut)
 *         itemAmount:
 *           type: number
 *           description: Item amount
 *         product_id:
 *           type: string
 *           description: Product ID
 */

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests (Admin) or user's own requests (Staff)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       401:
 *         description: Not authorized
 */
router.route("/").get(protect, getRequests);

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new request (Staff only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       201:
 *         description: Request created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied
 */
router.route("/").post(protect, createRequest);

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Get request by ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request details
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Request not found
 */
router.route("/:id").get(protect, getRequest);

/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     summary: Update request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       200:
 *         description: Request updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Request not found
 */
router.route("/:id").put(protect, updateRequest);

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Delete request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       400:
 *         description: Request cannot be deleted
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Request not found
 */
router.route("/:id").delete(protect, deleteRequest);

module.exports = router;
