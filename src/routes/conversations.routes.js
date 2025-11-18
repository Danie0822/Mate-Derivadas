const express = require('express');
const router = express.Router();
const ConversationController = require('../controllers/conversation.controller');
const validateRequest = require('../utils/validateRequest');
const {
    updateConversationNameSchema,
    toggleFavoriteSchema,
    deleteConversationSchema
} = require('../validations/conversation.schema');

/**
 * @swagger
 * /conversations/{id}/name:
 *   put:
 *     summary: Actualizar el nombre de una conversación
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
 *                 description: Nuevo nombre para la conversación
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Nombre actualizado exitosamente
 *       404:
 *         description: Conversación no encontrada
 */
router.put(
    '/:id/name',
    validateRequest(updateConversationNameSchema),
    ConversationController.updateName
);

/**
 * @swagger
 * /conversations/{id}/favorite:
 *   put:
 *     summary: Alternar el estado de favorito de una conversación
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
 *               is_favorite:
 *                 type: boolean
 *                 description: Estado de favorito
 *             required:
 *               - is_favorite
 *     responses:
 *       200:
 *         description: Estado de favorito actualizado
 *       404:
 *         description: Conversación no encontrada
 */
router.put(
    '/:id/favorite',
    validateRequest(toggleFavoriteSchema),
    ConversationController.toggleFavorite
);

/**
 * @swagger
 * /conversations/{id}:
 *   delete:
 *     summary: Eliminar una conversación
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
 *         description: Conversación eliminada exitosamente
 *       404:
 *         description: Conversación no encontrada
 */
router.delete(
    '/:id',
    validateRequest(deleteConversationSchema),
    ConversationController.delete
);

module.exports = router;