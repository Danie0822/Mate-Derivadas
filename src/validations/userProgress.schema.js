const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProgress:
 *       type: object
 *       required:
 *         - user_id
 *         - study_guide_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user progress.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: The user ID.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         study_guide_id:
 *           type: string
 *           format: uuid
 *           description: The study guide ID.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         completed:
 *           type: boolean
 *           description: Whether the user completed this part.
 *           example: true
 *         completed_at:
 *           type: string
 *           format: date-time
 *           description: When the user completed this part.
 *           example: "2025-09-06T12:00:00.000Z"
 */

const params = z.object({
  id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

const userProgressSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string({ required_error: 'User ID is required' }).uuid('User ID must be a valid UUID'),
  study_guide_id: z.string({ required_error: 'Study guide ID is required' }).uuid('Study guide ID must be a valid UUID'),
  completed: z.boolean().optional(),
  completed_at: z.string().datetime().nullable().optional(),
});

const readUserProgressRequestSchema = z.object({
  params,
});

const createUserProgressRequestSchema = z.object({
  body: userProgressSchema.omit({ id: true }),
});

const updateUserProgressRequestSchema = z.object({
  params,
  body: userProgressSchema.omit({ id: true }),
});

const deleteUserProgressRequestSchema = z.object({
  params,
});

module.exports = {
  readUserProgressRequestSchema,
  createUserProgressRequestSchema,
  updateUserProgressRequestSchema,
  deleteUserProgressRequestSchema,
};
