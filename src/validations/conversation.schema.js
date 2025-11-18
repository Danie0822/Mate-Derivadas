const { z } = require('zod');

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