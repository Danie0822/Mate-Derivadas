const express = require('express');
const router = express.Router();
const UserExerciseController = require('../controllers/userExercise.controller');
const validateRequest = require('../utils/validateRequest');
const {
    readUserExerciseRequestSchema,
    createUserExerciseRequestSchema,
    updateUserExerciseRequestSchema,
    deleteUserExerciseRequestSchema
} = require('../validations/userExercise.schema');

/**
 * @swagger
 * tags:
 *   name: UserExercises
 *   description: User exercise management
 */

/**
 * @swagger
 * /user-exercises:
 *   post:
 *     summary: Create a new user exercise record
 *     tags: [UserExercises]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserExercise'
 *     responses:
 *       201:
 *         description: User exercise created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserExercise'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
    '/',
    validateRequest(createUserExerciseRequestSchema),
    UserExerciseController.save
);

/**
 * @swagger
 * /user-exercises:
 *   get:
 *     summary: Get all user exercise records
 *     tags: [UserExercises]
 *     responses:
 *       200:
 *         description: List of user exercise records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserExercise'
 */
router.get('/', UserExerciseController.getAll);

/**
 * @swagger
 * /user-exercises/{id}:
 *   get:
 *     summary: Get a user exercise record by ID
 *     tags: [UserExercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User exercise ID
 *     responses:
 *       200:
 *         description: User exercise data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserExercise'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readUserExerciseRequestSchema), UserExerciseController.getById);

/**
 * @swagger
 * /user-exercises/{id}:
 *   put:
 *     summary: Update a user exercise record
 *     tags: [UserExercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User exercise ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserExercise'
 *     responses:
 *       200:
 *         description: User exercise updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserExercise'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put(
    '/:id',
    validateRequest(updateUserExerciseRequestSchema),
    UserExerciseController.update
);

/**
 * @swagger
 * /user-exercises/{id}:
 *   delete:
 *     summary: Delete a user exercise record
 *     tags: [UserExercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User exercise ID
 *     responses:
 *       200:
 *         description: User exercise deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User exercise deleted successfully"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteUserExerciseRequestSchema), UserExerciseController.destroy);

module.exports = router;
