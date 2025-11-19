const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} = require("../controllers/products");

const router = express.Router();

const { protect, authorize, optionalAuth } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - sku
 *         - description
 *         - category
 *         - price
 *         - stockQuantity
 *         - unit
 *         - picture
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *         sku:
 *           type: string
 *           description: Stock Keeping Unit (unique identifier)
 *         description:
 *           type: string
 *           description: Product description
 *         category:
 *           type: string
 *           description: Product category
 *         price:
 *           type: number
 *           description: Product price
 *         stockQuantity:
 *           type: number
 *           description: Current stock quantity
 *         unit:
 *           type: string
 *           description: Unit of measurement
 *         picture:
 *           type: string
 *           description: URL to product picture
 *         isActive:
 *           type: boolean
 *           description: Product status
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (admins see hidden products too)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.route("/").get(optionalAuth, getProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied
 */
router.route("/").post(protect, authorize("admin"), createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.route("/:id").get(getProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 */
router.route("/:id").put(protect, authorize("admin"), updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 */
router.route("/:id").delete(protect, authorize("admin"), deleteProduct);

/**
 * @swagger
 * /products/{id}/stock:
 *   put:
 *     summary: Update product stock quantity
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockQuantity:
 *                 type: number
 *                 description: New stock quantity
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       400:
 *         description: Invalid stock quantity
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 */
router.route("/:id/stock").put(protect, authorize("admin"), updateStock);

module.exports = router;
