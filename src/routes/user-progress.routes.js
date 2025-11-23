const express = require('express');
const router = express.Router();
const UserProgressController = require('../controllers/userProgress.controller');
const validateRequest = require('../utils/validateRequest');
const {
    readUserProgressRequestSchema,
    createUserProgressRequestSchema,
    updateUserProgressRequestSchema,
    deleteUserProgressRequestSchema
} = require('../validations/userProgress.schema');

/**
 * @swagger
 * tags:
 *   name: UserProgress
 *   description: User progress management
 */

/**
 * @swagger
 * /user-progress:
 *   post:
 *     summary: Create a new user progress record
 *     tags: [UserProgress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProgress'
 *     responses:
 *       201:
 *         description: User progress created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProgress'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
    '/',
    validateRequest(createUserProgressRequestSchema),
    UserProgressController.save
);

/**
 * @swagger
 * /user-progress:
 *   get:
 *     summary: Get all user progress records
 *     tags: [UserProgress]
 *     responses:
 *       200:
 *         description: List of user progress records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProgress'
 */
router.get('/', UserProgressController.getAll);

/**
 * @swagger
 * /user-progress/{id}:
 *   get:
 *     summary: Get a user progress record by ID
 *     tags: [UserProgress]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User progress ID
 *     responses:
 *       200:
 *         description: User progress data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProgress'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readUserProgressRequestSchema), UserProgressController.getById);

/**
 * @swagger
 * /user-progress/{id}:
 *   put:
 *     summary: Update a user progress record
 *     tags: [UserProgress]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User progress ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProgress'
 *     responses:
 *       200:
 *         description: User progress updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProgress'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put(
    '/:id',
    validateRequest(updateUserProgressRequestSchema),
    UserProgressController.update
);

/**
 * @swagger
 * /user-progress/{id}:
 *   delete:
 *     summary: Delete a user progress record
 *     tags: [UserProgress]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User progress ID
 *     responses:
 *       200:
 *         description: User progress deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User progress deleted successfully"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteUserProgressRequestSchema), UserProgressController.destroy);

module.exports = router;
