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
 *       400:
 *         description: Validation error
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
 *       404:
 *         description: Not found
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
 *       404:
 *         description: Not found
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
 *       404:
 *         description: Not found
 */
router.delete('/:id', validateRequest(deleteExerciseRequestSchema), ExerciseController.destroy);

module.exports = router;
