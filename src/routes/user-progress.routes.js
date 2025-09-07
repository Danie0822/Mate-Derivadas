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
 *       400:
 *         description: Validation error
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
 *       404:
 *         description: Not found
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
 *       404:
 *         description: Not found
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
 *       404:
 *         description: Not found
 */
router.delete('/:id', validateRequest(deleteUserProgressRequestSchema), UserProgressController.destroy);

module.exports = router;
