const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { Conversation, User, AIQuestion } = require('../models');
const ConversationNamingService = require('../services/conversationNamingService');
const { Op } = require('sequelize');

class ConversationController {
    static service = new CrudService(Conversation);
    static aiQuestionService = new CrudService(AIQuestion);
    static routes = '/conversations';

    // Incluir información del usuario
    static userInclude = [{
        model: User,
        as: 'user',
        attributes: ['id', 'full_name', 'email']
    }];

    // Incluir resumen de mensajes
    static messagesInclude = [{
        model: AIQuestion,
        as: 'aiQuestions',
        attributes: ['id', 'question', 'created_at'],
        limit: 1,
        order: [['created_at', 'ASC']]
    }];

    // Obtener todas las conversaciones de un usuario
    static getUserConversations = catchErrors(async (req, res, next) => {
        const { user_id } = req.params;
        const { page = 1, limit = 20, favorites_only = false, search = '' } = req.query;

        // Construir filtros
        const whereClause = { user_id };
        
        if (favorites_only === 'true') {
            whereClause.is_favorite = true;
        }

        if (search.trim()) {
            whereClause.name = {
                [Op.iLike]: `%${search.trim()}%`
            };
        }

        // Obtener conversaciones con paginación
        const { count, rows: conversations } = await ConversationController.service.findAndCountAll({
            where: whereClause,
            include: [
                ...ConversationController.userInclude,
                {
                    model: AIQuestion,
                    as: 'aiQuestions',
                    attributes: ['id', 'question', 'created_at'],
                    required: false,
                    separate: true,
                    limit: 1,
                    order: [['created_at', 'ASC']]
                }
            ],
            order: [
                ['is_favorite', 'DESC'],
                ['updated_at', 'DESC']
            ],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });

        // Calcular estadísticas para cada conversación
        const conversationsWithStats = await Promise.all(
            conversations.map(async (conv) => {
                // Usar el método count directo en el modelo AIQuestion
                const messageCount = await AIQuestion.count({
                    where: { conversation_id: conv.id }
                });

                return {
                    ...conv.toJSON(),
                    message_count: messageCount,
                    first_message: conv.aiQuestions?.[0]?.question || null
                };
            })
        );

        const totalPages = Math.ceil(count / parseInt(limit));

        return ApiResponse.success(res, {
            data: {
                conversations: conversationsWithStats,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: totalPages,
                    total_count: count,
                    per_page: parseInt(limit)
                }
            },
            route: ConversationController.routes,
            message: 'User conversations retrieved'
        });
    });

    // Obtener una conversación específica con su historial
    static getConversationById = catchErrors(async (req, res, next) => {
        const { id } = req.params;
        const { include_messages = true } = req.query;

        const includeArray = [...ConversationController.userInclude];
        
        if (include_messages === 'true') {
            includeArray.push({
                model: AIQuestion,
                as: 'aiQuestions',
                attributes: ['id', 'question', 'answer', 'created_at'],
                order: [['created_at', 'ASC']]
            });
        }

        const conversation = await ConversationController.service.findById(id, {
            include: includeArray
        });

        if (!conversation) {
            return ApiResponse.error(res, {
                error: 'Conversation not found',
                route: ConversationController.routes,
                status: 404
            });
        }

        const messageCount = await AIQuestion.count({
            where: { conversation_id: id }
        });

        const result = {
            ...conversation.toJSON(),
            message_count: messageCount
        };

        return ApiResponse.success(res, {
            data: result,
            route: ConversationController.routes,
            message: 'Conversation retrieved'
        });
    });

    // Crear nueva conversación
    static createConversation = catchErrors(async (req, res, next) => {
        const { user_id, name, is_favorite = false } = req.body;

        const conversation = await ConversationController.service.create({
            user_id,
            name: name || null,
            is_favorite
        });

        // Recargar con includes
        const fullConversation = await ConversationController.service.findById(conversation.id, {
            include: ConversationController.userInclude
        });

        return ApiResponse.success(res, {
            data: fullConversation,
            route: ConversationController.routes,
            message: 'Conversation created successfully',
            status: 201
        });
    });

    // Actualizar conversación (nombre, favorito)
    static updateConversation = catchErrors(async (req, res, next) => {
        const { id } = req.params;
        const { name, is_favorite } = req.body;

        // Validar que la conversación existe
        const conversation = await ConversationController.service.findById(id);
        if (!conversation) {
            return ApiResponse.error(res, {
                error: 'Conversation not found',
                route: ConversationController.routes,
                status: 404
            });
        }

        // Validar nombre si se proporciona
        const updateData = {};
        if (name !== undefined) {
            if (!ConversationNamingService.validateConversationName(name)) {
                return ApiResponse.error(res, {
                    error: 'Invalid conversation name. Must be between 1 and 255 characters.',
                    route: ConversationController.routes,
                    status: 400
                });
            }
            updateData.name = name.trim();
        }

        if (is_favorite !== undefined) {
            updateData.is_favorite = Boolean(is_favorite);
        }

        // Actualizar
        await ConversationController.service.update(id, updateData);

        // Obtener conversación actualizada
        const updatedConversation = await ConversationController.service.findById(id, {
            include: ConversationController.userInclude
        });

        return ApiResponse.success(res, {
            data: updatedConversation,
            route: ConversationController.routes,
            message: 'Conversation updated successfully'
        });
    });

    // Eliminar conversación
    static deleteConversation = catchErrors(async (req, res, next) => {
        const { id } = req.params;

        // Verificar que existe
        const conversation = await ConversationController.service.findById(id);
        if (!conversation) {
            return ApiResponse.error(res, {
                error: 'Conversation not found',
                route: ConversationController.routes,
                status: 404
            });
        }

        // Eliminar (esto también eliminará las preguntas por cascade)
        await ConversationController.service.delete(id);

        return ApiResponse.success(res, {
            data: { id },
            route: ConversationController.routes,
            message: 'Conversation deleted successfully'
        });
    });

    // Generar nombre automático para conversación
    static generateConversationName = catchErrors(async (req, res, next) => {
        const { id } = req.params;

        // Verificar que la conversación existe
        const conversation = await ConversationController.service.findById(id);
        if (!conversation) {
            return ApiResponse.error(res, {
                error: 'Conversation not found',
                route: ConversationController.routes,
                status: 404
            });
        }

        // Obtener el primer mensaje
        const firstMessage = await AIQuestion.findOne({
            where: { conversation_id: id },
            order: [['created_at', 'ASC']],
            attributes: ['question']
        });

        if (!firstMessage) {
            return ApiResponse.error(res, {
                error: 'No messages found in conversation',
                route: ConversationController.routes,
                status: 400
            });
        }

        // Generar nombre
        const generatedName = await ConversationNamingService.generateConversationName(
            firstMessage.question
        );

        // Actualizar conversación
        await ConversationController.service.update(id, { name: generatedName });

        // Obtener conversación actualizada
        const updatedConversation = await ConversationController.service.findById(id, {
            include: ConversationController.userInclude
        });

        return ApiResponse.success(res, {
            data: {
                ...updatedConversation.toJSON(),
                generated_name: generatedName
            },
            route: ConversationController.routes,
            message: 'Conversation name generated successfully'
        });
    });

    // Obtener estadísticas de conversaciones del usuario
    static getUserConversationStats = catchErrors(async (req, res, next) => {
        const { user_id } = req.params;

        const [
            totalConversations,
            favoriteConversations,
            totalMessages
        ] = await Promise.all([
            ConversationController.service.count({ where: { user_id } }),
            ConversationController.service.count({ where: { user_id, is_favorite: true } }),
            AIQuestion.count({
                include: [{
                    model: Conversation,
                    as: 'conversation',
                    where: { user_id },
                    attributes: []
                }]
            })
        ]);

        return ApiResponse.success(res, {
            data: {
                total_conversations: totalConversations,
                favorite_conversations: favoriteConversations,
                total_messages: totalMessages,
                average_messages_per_conversation: totalConversations > 0 
                    ? Math.round(totalMessages / totalConversations * 100) / 100 
                    : 0
            },
            route: ConversationController.routes,
            message: 'User conversation statistics retrieved'
        });
    });
}

module.exports = ConversationController;