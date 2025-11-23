const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       required:
 *         - user_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the conversation.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: The user ID who owns this conversation.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           description: The name of the conversation.
 *           example: "My calculus questions"
 *         is_favorite:
 *           type: boolean
 *           description: Whether this conversation is marked as favorite.
 *           example: false
 *         is_chat_ia:
 *           type: boolean
 *           description: Whether this is an AI chat conversation.
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the conversation was created.
 *           example: "2025-09-06T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the conversation was last updated.
 *           example: "2025-09-06T12:00:00.000Z"
 */

const updateConversationNameSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID de conversación debe ser un UUID válido')
    }),
    body: z.object({
        name: z.string()
            .min(1, 'El nombre no puede estar vacío')
            .max(100, 'El nombre no puede exceder 100 caracteres')
            .trim()
    })
});

const toggleFavoriteSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID de conversación debe ser un UUID válido')
    }),
    body: z.object({
        is_favorite: z.boolean('is_favorite debe ser un valor booleano')
    })
});

const deleteConversationSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID de conversación debe ser un UUID válido')
    })
});

module.exports = {
    updateConversationNameSchema,
    toggleFavoriteSchema,
    deleteConversationSchema
};