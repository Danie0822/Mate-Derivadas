const { z } = require('zod');

/**
 * Esquemas de validación para las rutas de conversaciones
 * Estos esquemas validan los parámetros, query strings y cuerpos de las peticiones HTTP
 */

// Esquema para obtener conversaciones de un usuario con filtros y paginación
const getUserConversationsSchema = z.object({
    params: z.object({
        user_id: z.string().uuid('User ID must be a valid UUID')
    }),
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        favorites_only: z.enum(['true', 'false']).optional(),
        search: z.string().optional()
    }).optional()
});

// Esquema para obtener una conversación específica por ID
const getConversationByIdSchema = z.object({
    params: z.object({
        id: z.string().uuid('Conversation ID must be a valid UUID')
    }),
    query: z.object({
        include_messages: z.enum(['true', 'false']).optional()
    }).optional()
});

// Esquema para crear una nueva conversación
const createConversationSchema = z.object({
    body: z.object({
        user_id: z.string().uuid('User ID must be a valid UUID'),
        name: z.string().min(1).max(255).optional(),
        is_favorite: z.boolean().optional()
    })
});

// Esquema para actualizar una conversación existente
const updateConversationSchema = z.object({
    params: z.object({
        id: z.string().uuid('Conversation ID must be a valid UUID')
    }),
    body: z.object({
        name: z.string().min(1).max(255).optional(),
        is_favorite: z.boolean().optional()
    }).refine(data => data.name !== undefined || data.is_favorite !== undefined, {
        message: "At least one field (name or is_favorite) must be provided"
    })
});

// Esquema para eliminar una conversación
const deleteConversationSchema = z.object({
    params: z.object({
        id: z.string().uuid('Conversation ID must be a valid UUID')
    })
});

// Esquema para generar nombre automático de conversación (reutiliza validación de ID)
const generateNameSchema = z.object({
    params: z.object({
        id: z.string().uuid('Conversation ID must be a valid UUID')
    })
});

module.exports = {
    getUserConversationsSchema,
    getConversationByIdSchema,
    createConversationSchema,
    updateConversationSchema,
    deleteConversationSchema,
    generateNameSchema
};