
const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { AIQuestion, Conversation, User } = require('../models');
const { getAIAnswer } = require('../services/aiService');
const ConversationNamingService = require('../services/conversationNamingService');


class AIQuestionController {
    static service = new CrudService(AIQuestion);
    static serviceConversation = new CrudService(Conversation);
    static routes = '/ai-questions';
    static includesConversation = [{
        model: User,
        as: 'user',
        attributes: ['id', 'full_name']
    }];
    static Include = [{
        model: Conversation,
        as: 'conversation',
         attributes: ['id', 'user_id'],
        include: {
            model: User,
            as: 'user',
            attributes: ['id', 'full_name']
        }
    }];

    // req.body: { user_id, question, conversation_id? }
    static ask = catchErrors(async (req, res, next) => {
        const { user_id, question, conversation_id } = req.body;
        let conversation;
        let isNewConversation = false;
        
        // Buscar conversación específica o crear una nueva
        if (conversation_id !== undefined) {
            conversation = await this.serviceConversation.findById(conversation_id);
            if (conversation === null) {
                return ApiResponse.error(res, { error: 'Conversation not found', route: this.routes, status: 404 });
            }
        } else {
            // Crear nueva conversación directamente
            conversation = await this.serviceConversation.create({ user_id });
            isNewConversation = true;
            console.log(`🆕 Nueva conversación creada ${conversation.id} para usuario ${user_id}`);
        }

        // Obtener historial de mensajes de la conversación (limitamos a los últimos 8 intercambios para evitar exceder límites de tokens)
        const history = await this.service.findAll({
            where: { conversation_id: conversation.id },
            order: [['created_at', 'ASC']], // Orden ascendente para mantener cronología
            limit: 16 // 8 intercambios = 16 mensajes (pregunta + respuesta)
        });
        
        console.log(`📚 Historial encontrado: ${history.length} mensajes para conversación ${conversation.id}`);
        
        // Debug: mostrar el historial
        if (history.length > 0) {
            console.log('🔍 Historial de conversación:');
            history.forEach((msg, index) => {
                console.log(`  ${index + 1}. P: ${msg.question?.substring(0, 50)}...`);
                console.log(`     R: ${msg.answer?.substring(0, 50)}...`);
            });
        }
        
        // Construir el contexto para la IA manteniendo la continuidad
        const messages = [
            { 
                role: 'system', 
                content: `Eres un experto en matemáticas especializado en derivadas. Responde de forma clara y precisa en español. 
                
IMPORTANTE: Tienes memoria de conversaciones anteriores. Si el usuario hace referencia a algo mencionado antes, debes recordarlo y mantener coherencia. 
                Si el usuario te dice su nombre o información personal, recuérdalo para futuras interacciones en esta conversación.
                Nunca digas que no puedes recordar conversaciones anteriores.`
            }
        ];
        
        // Agregar historial de la conversación en orden cronológico
        history.forEach((msg, index) => {
            if (msg.question && msg.answer) {
                messages.push({ role: 'user', content: msg.question });
                messages.push({ role: 'assistant', content: msg.answer });
                console.log(`  ➕ Agregado mensaje ${index + 1} al contexto`);
            }
        });
        
        // Agregar la pregunta actual
        messages.push({ role: 'user', content: question });
        console.log(`📤 Enviando ${messages.length} mensajes a OpenRoute (${history.length} del historial + sistema + pregunta actual)`);
        
        console.log(`🤖 Enviando ${messages.length} mensajes a OpenRoute (incluyendo sistema y nueva pregunta)`);
        
        // Llama a la IA externa con el contexto completo
        const answer = await getAIAnswer(messages);
        
        if (!answer || answer.trim() === '') {
            console.error('❌ Respuesta vacía de OpenRoute');
            return ApiResponse.error(res, { error: 'No se pudo generar respuesta', route: this.routes, status: 500 });
        }
        
        // Guarda en historial para mantener continuidad
        const dataCreate = await this.service.create({ 
            conversation_id: conversation.id, 
            question, 
            answer: answer.trim()
        });
        
        console.log(`✅ Respuesta guardada en conversación ${conversation.id}`);

        // Si es una conversación nueva, generar nombre automáticamente
        if (isNewConversation || (history.length === 0 && !conversation.name)) {
            try {
                const generatedName = await ConversationNamingService.generateConversationName(question);
                await this.serviceConversation.update(conversation.id, { 
                    name: generatedName,
                    updated_at: new Date()
                });
                conversation.name = generatedName; // Actualizar objeto local
                console.log(`🏷️ Nombre generado automáticamente: "${generatedName}"`);
            } catch (error) {
                console.error('❌ Error generando nombre automático:', error.message);
                // No afecta la funcionalidad principal, solo logueamos el error
            }
        }
        if (dataCreate) {
            return ApiResponse.success(res, { 
                data: dataCreate, 
                conversation: {
                    id: conversation.id,
                    name: conversation.name,
                    user_id: conversation.user_id,
                    is_favorite: conversation.is_favorite,
                    created_at: conversation.created_at,
                    updated_at: conversation.updated_at
                },
                route: this.routes, 
                message: 'AI answer generated' 
            });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });
    // Obtener conversaciones del usuario con información mejorada
    static getConversationUser = catchErrors(async (req, res, next) => {
        const { user_id } = req.params;
        
        try {
            // Obtener conversaciones con orden por fecha de actualización
            const conversations = await this.serviceConversation.findAll({ 
                where: { user_id },
                order: [
                    ['is_favorite', 'DESC'],
                    ['updated_at', 'DESC']
                ]
            });

            if (conversations && conversations.length > 0) {
                // Agregar estadísticas de mensajes para cada conversación
                const conversationsWithStats = await Promise.all(
                    conversations.map(async (conv) => {
                        try {
                            const messageCount = await this.service.count({
                                where: { conversation_id: conv.id }
                            });
                            
                            // Obtener el primer mensaje para preview
                            const firstMessage = await this.service.findOne({
                                where: { conversation_id: conv.id },
                                order: [['created_at', 'ASC']]
                            });

                            return {
                                ...conv.toJSON(),
                                message_count: messageCount,
                                preview: firstMessage ? firstMessage.question.substring(0, 100) + '...' : null
                            };
                        } catch (error) {
                            console.error(`Error processing conversation ${conv.id}:`, error);
                            return {
                                ...conv.toJSON(),
                                message_count: 0,
                                preview: null
                            };
                        }
                    })
                );

                return ApiResponse.success(res, { 
                    data: conversationsWithStats, 
                    route: this.routes,
                    message: `Found ${conversationsWithStats.length} conversations` 
                });
            }
            
            return ApiResponse.success(res, { 
                data: [], 
                route: this.routes,
                message: 'No conversations found for this user' 
            });
        } catch (error) {
            console.error('Error in getConversationUser:', error);
            return ApiResponse.error(res, { 
                error: 'Error loading conversations', 
                route: this.routes, 
                status: 500 
            });
        }
    });

    // Obtener historial completo de una conversación específica
    static getConversationHistory = catchErrors(async (req, res, next) => {
        const { conversation_id } = req.params;
        
        // Verificar que la conversación existe
        const conversation = await this.serviceConversation.findById(conversation_id);
        if (!conversation) {
            return ApiResponse.error(res, { error: 'Conversation not found', route: this.routes, status: 404 });
        }
        
        // Obtener todo el historial de la conversación
        const history = await this.service.findAll({
            where: { conversation_id },
            order: [['created_at', 'ASC']],
            include: [{
                model: Conversation,
                as: 'conversation',
                attributes: ['id', 'user_id'],
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name']
                }
            }]
        });
        
        console.log(`📜 Recuperando historial completo de conversación ${conversation_id}: ${history.length} mensajes`);
        
        return ApiResponse.success(res, { 
            data: {
                conversation,
                messages: history
            }, 
            route: this.routes,
            message: 'Conversation history retrieved'
        });
    });

    // Obtener o crear conversación activa para un usuario
    static getOrCreateActiveConversation = catchErrors(async (req, res, next) => {
        const { user_id } = req.params;
        
        // Buscar la conversación más reciente del usuario
        const existingConversations = await this.serviceConversation.findAll({
            where: { user_id },
            order: [['created_at', 'DESC']],
            limit: 1,
            include: this.includesConversation
        });
        
        let conversation;
        let isNew = false;
        
        if (existingConversations && existingConversations.length > 0) {
            conversation = existingConversations[0];
        } else {
            conversation = await this.serviceConversation.create({ user_id });
            isNew = true;
            // Recargar con includes
            conversation = await this.serviceConversation.findById(conversation.id, { 
                include: this.includesConversation 
            });
        }
        
        // Obtener el conteo de mensajes
        const messageCount = await this.service.count({
            where: { conversation_id: conversation.id }
        });
        
        return ApiResponse.success(res, { 
            data: {
                ...conversation.toJSON(),
                message_count: messageCount,
                is_new: isNew
            }, 
            route: this.routes,
            message: isNew ? 'New conversation created' : 'Active conversation retrieved'
        });
    });

    static getAll = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll({ include: this.Include });
        return ApiResponse.success(res, { data, route: this.routes, message: 'AIQuestion list' });
    });

    static getById = catchErrors(async (req, res, next) => {
        const data = await this.service.findById(req.params.id, { include: this.Include });
        if (data) {
            return ApiResponse.success(res, { data, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'AIQuestion not found', route: this.routes, status: 404 });
    });
}

module.exports = AIQuestionController;
