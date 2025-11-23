const express = require('express');
const router = express.Router();
const StudyGuideController = require('../controllers/studyGuide.controller');
const validateRequest = require('../utils/validateRequest');
const {
  readStudyGuideRequestSchema,
  createStudyGuideRequestSchema,
  updateStudyGuideRequestSchema,
  deleteStudyGuideRequestSchema
} = require('../validations/studyGuide.schema');

/**
 * @swagger
 * tags:
 *   name: StudyGuides
 *   description: Study guide management
 */

/**
 * @swagger
 * /study-guides:
 *   post:
 *     summary: Create a new study guide
 *     tags: [StudyGuides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudyGuide'
 *     responses:
 *       201:
 *         description: Study guide created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudyGuide'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
  '/',
  validateRequest(createStudyGuideRequestSchema),
  StudyGuideController.save
);

/**
 * @swagger
 * /study-guides:
 *   get:
 *     summary: Get all study guides
 *     tags: [StudyGuides]
 *     responses:
 *       200:
 *         description: List of study guides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudyGuide'
 */
router.get('/', StudyGuideController.getAll);

/**
 * @swagger
 * /study-guides/{id}:
 *   get:
 *     summary: Get a study guide by ID
 *     tags: [StudyGuides]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Study guide ID
 *     responses:
 *       200:
 *         description: Study guide data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudyGuide'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readStudyGuideRequestSchema), StudyGuideController.getById);

/**
 * @swagger
 * /study-guides/{id}:
 *   put:
 *     summary: Update a study guide
 *     tags: [StudyGuides]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Study guide ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudyGuide'
 *     responses:
 *       200:
 *         description: Study guide updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudyGuide'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put(
  '/:id',
  validateRequest(updateStudyGuideRequestSchema),
  StudyGuideController.update
);

/**
 * @swagger
 * /study-guides/{id}:
 *   delete:
 *     summary: Delete a study guide
 *     tags: [StudyGuides]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Study guide ID
 *     responses:
 *       200:
 *         description: Study guide deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Study guide deleted successfully"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteStudyGuideRequestSchema), StudyGuideController.destroy);

/**
 * @swagger
 * /study-guides/{id}/exercises:
 *   get:
 *     summary: Get exercises related to a study guide
 *     tags: [StudyGuides]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Study guide ID
 *     responses:
 *       200:
 *         description: List of related exercises with metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Exercise'
 *                       - type: object
 *                         properties:
 *                           order:
 *                             type: integer
 *                             description: Order of exercise in study guide
 *                           required:
 *                             type: boolean
 *                             description: Whether exercise is required
 *                           notes:
 *                             type: string
 *                             description: Additional notes from study guide
 *       404:
 *         description: Study guide not found
 */
router.get('/:id/exercises', validateRequest(readStudyGuideRequestSchema), StudyGuideController.getRelatedExercises);

module.exports = router;
