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
 *       404:
 *         description: No se encontraron conversaciones
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
 *             $ref: '#/components/schemas/AIQuestion'
 *     responses:
 *       201:
 *         description: AI answer generated and saved
 *       400:
 *         description: Validation error
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
 *       404:
 *         description: Conversación no encontrada
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
 *       404:
 *         description: Not found
 */
router.get('/:id', validateRequest(readAIQuestionRequestSchema), AIQuestionController.getById);

module.exports = router;
