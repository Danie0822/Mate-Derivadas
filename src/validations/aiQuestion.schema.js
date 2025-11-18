const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     AIQuestion:
 *       type: object
 *       required:
 *         - user_id
 *         - question
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the AI question.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: The user ID.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         conversation_id:
 *           type: string
 *           format: uuid
 *           description: The conversation ID.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         question:
 *           type: string
 *           description: The user's question.
 *           example: "What is the derivative of x^2?"
 *         answer:
 *           type: string
 *           description: The AI's answer.
 *           example: "The derivative of x^2 is 2x."
 */

const params = z.object({
  id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

const aiQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string({ required_error: 'User ID is required' }).uuid('User ID must be a valid UUID'),
  question: z.string({ required_error: 'Question is required' })
    .min(2, 'Question must be at least 2 characters'),
  answer: z.string().optional(),
  conversation_id: z.string().uuid().optional(),
  is_chat_ia: z.boolean().optional().default(false),
});

const askAIQuestionRequestSchema = z.object({
  body: z.object({
    user_id: z.string({ required_error: 'User ID is required' }).uuid('User ID must be a valid UUID'),
    question: z.string({ required_error: 'Question is required' })
      .min(2, 'Question must be at least 2 characters'),
    conversation_id: z.string().uuid().optional().nullable(),
    is_chat_ia: z.boolean().optional().default(false),
  }),
});


const getConversationUserRequestSchema = z.object({
  params: z.object({
    user_id: z.string().uuid({ message: 'User ID must be a valid UUID' })
  })
});

const readAIQuestionRequestSchema = z.object({
  params,
});

module.exports = {
  askAIQuestionRequestSchema,
  readAIQuestionRequestSchema,
  getConversationUserRequestSchema,
};
