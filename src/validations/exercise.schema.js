const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       required:
 *         - title
 *         - difficulty
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the exercise.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         title:
 *           type: string
 *           description: The title of the exercise.
 *           example: "Derivative of x^2"
 *         description:
 *           type: string
 *           description: The description of the exercise.
 *           example: "Find the derivative of the function f(x) = x^2."
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: The difficulty level of the exercise.
 *           example: "easy"
 *         content:
 *           type: object
 *           description: The content of the exercise (e.g., question, variables).
 *           example: { "question": "What is the derivative of x^2?" }
 *         solution:
 *           type: object
 *           description: The solution to the exercise.
 *           example: { "answer": "2x" }
 *         topic:
 *           type: string
 *           description: The topic or category of the exercise.
 *           example: "Derivatives"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the exercise.
 *           example: ["calculus", "basic", "polynomial"]
 */

const params = z.object({
  id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

const exerciseSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string({ required_error: 'Title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must not exceed 255 characters'),
  description: z.string().max(10000, 'Description too long').nullable().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard'], { required_error: 'Difficulty is required' }),
  content: z.record(z.any(), { required_error: 'Content is required' }),
  solution: z.record(z.any()).optional(),
  topic: z.string().max(255, 'Topic too long').nullable().optional(),
  tags: z.array(z.string()).nullable().optional().default([]),
});

const readExerciseRequestSchema = z.object({
  params,
});

const createExerciseRequestSchema = z.object({
  body: exerciseSchema.omit({ id: true }),
});

const updateExerciseRequestSchema = z.object({
  params,
  body: exerciseSchema.omit({ id: true }),
});

const deleteExerciseRequestSchema = z.object({
  params,
});

module.exports = {
  readExerciseRequestSchema,
  createExerciseRequestSchema,
  updateExerciseRequestSchema,
  deleteExerciseRequestSchema,
};
