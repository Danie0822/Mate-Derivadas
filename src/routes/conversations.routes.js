const express = require('express');
const router = express.Router();
const ConversationController = require('../controllers/conversation.controller');
const validateRequest = require('../utils/validateRequest');

// Importar esquemas de validación
const {
    getUserConversationsSchema,
    getConversationByIdSchema,
    createConversationSchema,
    updateConversationSchema,
    deleteConversationSchema,
    generateNameSchema
} = require('../validations/conversation.schema');

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Gestión de conversaciones de IA
 */

/**
 * @swagger
 * /conversations/user/{user_id}:
 *   get:
 *     summary: Obtener conversaciones del usuario
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del usuario
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Elementos por página
 *       - in: query
 *         name: favorites_only
 *         schema:
 *           type: boolean
 *         description: Solo mostrar favoritos
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre
 *     responses:
 *       200:
 *         description: Lista de conversaciones del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
    '/user/:user_id',
    validateRequest(getUserConversationsSchema),
    ConversationController.getUserConversations
);



/**
 * @swagger
 * /conversations/{id}:
 *   get:
 *     summary: Obtener conversación específica
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la conversación
 *       - in: query
 *         name: include_messages
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Incluir mensajes de la conversación
 *     responses:
 *       200:
 *         description: Datos de la conversación
 *       404:
 *         description: Conversación no encontrada
 */
router.get(
    '/:id',
    validateRequest(getConversationByIdSchema),
    ConversationController.getConversationById
);

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Crear nueva conversación
 *     tags: [Conversations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *                 maxLength: 255
 *               is_favorite:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Conversación creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
    '/',
    validateRequest(createConversationSchema),
    ConversationController.createConversation
);

/**
 * @swagger
 * /conversations/{id}:
 *   put:
 *     summary: Actualizar conversación
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la conversación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *               is_favorite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Conversación actualizada
 *       404:
 *         description: Conversación no encontrada
 */
router.put(
    '/:id',
    validateRequest(updateConversationSchema),
    ConversationController.updateConversation
);

/**
 * @swagger
 * /conversations/{id}:
 *   delete:
 *     summary: Eliminar conversación
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la conversación
 *     responses:
 *       200:
 *         description: Conversación eliminada
 *       404:
 *         description: Conversación no encontrada
 */
router.delete(
    '/:id',
    validateRequest(deleteConversationSchema),
    ConversationController.deleteConversation
);

/**
 * @swagger
 * /conversations/{id}/generate-name:
 *   post:
 *     summary: Generar nombre automático para conversación
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la conversación
 *     responses:
 *       200:
 *         description: Nombre generado exitosamente
 *       404:
 *         description: Conversación no encontrada
 *       400:
 *         description: No hay mensajes en la conversación
 */
router.post(
    '/:id/generate-name',
    validateRequest(generateNameSchema),
    ConversationController.generateConversationName
);

module.exports = router;