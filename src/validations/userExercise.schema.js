const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserExercise:
 *       type: object
 *       required:
 *         - user_id
 *         - exercise_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user exercise.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: The user ID.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         exercise_id:
 *           type: string
 *           format: uuid
 *           description: The exercise ID.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         answer:
 *           type: object
 *           description: The user's answer to the exercise.
 *           example: { "answer": "2x" }
 *         is_correct:
 *           type: boolean
 *           description: Whether the answer is correct.
 *           example: true
 *         answered_at:
 *           type: string
 *           format: date-time
 *           description: When the user answered the exercise.
 *           example: "2025-09-06T12:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the record was created.
 *           example: "2025-09-06T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the record was last updated.
 *           example: "2025-09-06T12:00:00.000Z"
 */

const params = z.object({
  id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

const userExerciseSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string({ required_error: 'User ID is required' }).uuid('User ID must be a valid UUID'),
  exercise_id: z.string({ required_error: 'Exercise ID is required' }).uuid('Exercise ID must be a valid UUID'),
  answer: z.record(z.any()).optional(),
  is_correct: z.boolean().optional(),
  answered_at: z.string().datetime().nullable().optional(),
});

const readUserExerciseRequestSchema = z.object({
  params,
});

const createUserExerciseRequestSchema = z.object({
  body: userExerciseSchema.omit({ id: true }),
});

const updateUserExerciseRequestSchema = z.object({
  params,
  body: userExerciseSchema.omit({ id: true }),
});

const deleteUserExerciseRequestSchema = z.object({
  params,
});

module.exports = {
  readUserExerciseRequestSchema,
  createUserExerciseRequestSchema,
  updateUserExerciseRequestSchema,
  deleteUserExerciseRequestSchema,
};
