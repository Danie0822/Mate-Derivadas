const express = require('express');
const router = express.Router();
const AIQuestionController = require('../controllers/aiQuestion.controller');
const validateRequest = require('../utils/validateRequest');
const {
    askAIQuestionRequestSchema,
    readAIQuestionRequestSchema,
    getConversationUserRequestSchema
} = require('../validations/aiQuestion.schema');
/**
 * @swagger
 * tags:
 *   name: AIQuestions
 *   description: AI question and answer management
 */

/**
 * @swagger
 * /ai-questions/user/{user_id}:
 *   get:
 *     summary: Obtener todas las conversaciones de un usuario
 *     tags: [AIQuestions]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de conversaciones del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Conversation"
 *       404:
 *         description: No se encontraron conversaciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
    '/user/:user_id',
    validateRequest(getConversationUserRequestSchema),
    AIQuestionController.getConversationUser
);

/**
 * @swagger
 * tags:
 *   name: AIQuestions
 *   description: AI question and answer management
 */

/**
 * @swagger
 * /ai-questions/ask:
 *   post:
 *     summary: Ask a question to the AI
 *     tags: [AIQuestions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - question
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user asking the question
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               question:
 *                 type: string
 *                 description: The question to ask the AI
 *                 example: "What is the derivative of x^2?"
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: Optional conversation ID to continue an existing conversation
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               is_chat_ia:
 *                 type: boolean
 *                 description: Whether this is an AI chat question
 *                 example: false
 *     responses:
 *       201:
 *         description: AI answer generated and saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIQuestion'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
    '/ask',
    validateRequest(askAIQuestionRequestSchema),
    AIQuestionController.ask
);

/**
 * @swagger
 * /ai-questions:
 *   get:
 *     summary: Get all AI question records
 *     tags: [AIQuestions]
 *     responses:
 *       200:
 *         description: List of AI question records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AIQuestion'
 */
router.get('/', AIQuestionController.getAll);

/**
 * @swagger
 * /ai-questions/conversation/{conversation_id}/history:
 *   get:
 *     summary: Get conversation message history
 *     tags: [AIQuestions]
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la conversación
 *     responses:
 *       200:
 *         description: Historial de mensajes de la conversación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AIQuestion'
 *       404:
 *         description: Conversación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
    '/conversation/:conversation_id/history',
    AIQuestionController.getConversationHistory
);

/**
 * @swagger
 * /ai-questions/{id}:
 *   get:
 *     summary: Get an AI question record by ID
 *     tags: [AIQuestions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: AI question ID
 *     responses:
 *       200:
 *         description: AI question data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIQuestion'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readAIQuestionRequestSchema), AIQuestionController.getById);

module.exports = router;
