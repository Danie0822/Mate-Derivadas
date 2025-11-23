const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/exercise.controller');
const validateRequest = require('../utils/validateRequest');
const {
    readExerciseRequestSchema,
    createExerciseRequestSchema,
    updateExerciseRequestSchema,
    deleteExerciseRequestSchema
} = require('../validations/exercise.schema');

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Exercise management
 */

/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Create a new exercise
 *     tags: [Exercises]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercise'
 *     responses:
 *       201:
 *         description: Exercise created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
    '/',
    validateRequest(createExerciseRequestSchema),
    ExerciseController.save
);

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Get all exercises
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: List of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 */
router.get('/', ExerciseController.getAll);

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     summary: Get an exercise by ID
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readExerciseRequestSchema), ExerciseController.getById);

/**
 * @swagger
 * /exercises/{id}:
 *   put:
 *     summary: Update an exercise
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Exercise ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercise'
 *     responses:
 *       200:
 *         description: Exercise updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put(
    '/:id',
    validateRequest(updateExerciseRequestSchema),
    ExerciseController.update
);

/**
 * @swagger
 * /exercises/{id}:
 *   delete:
 *     summary: Delete an exercise
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Exercise deleted successfully"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteExerciseRequestSchema), ExerciseController.destroy);

/**
 * @swagger
 * /exercises/select/all:
 *   get:
 *     summary: Get all exercises for select component (id, title, topic only)
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: Exercise select list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   title:
 *                     type: string
 *                   topic:
 *                     type: string
 */
router.get('/select/all', ExerciseController.selectAll);

module.exports = router;
