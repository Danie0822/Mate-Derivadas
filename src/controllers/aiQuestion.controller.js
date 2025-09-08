
const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { AIQuestion, Conversation, User } = require('../models');
const { getAIAnswer } = require('../services/aiService');


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
        // Buscar la última conversación activa del usuario o crear una nueva
        if (conversation_id !== undefined) {
            conversation = await this.serviceConversation.findById(conversation_id);
            if (conversation === null) {
                return ApiResponse.error(res, { error: 'Conversation not found', route: this.routes, status: 404 });
            }
        } else {
            conversation = await this.serviceConversation.create({ user_id });
        }

        // Obtener historial de mensajes de la conversación
        const history = await this.service.findAll({
            where: { conversation_id: conversation.id },
            order: [['created_at', 'ASC']]
        });
        // Construir el contexto para la IA
        const messages = [
            { role: 'system', content: 'Eres un experto en matemáticas. Responde de forma clara y precisa, en español, especialmente sobre derivadas.' },
            ...history.flatMap(msg => [
                { role: 'user', content: msg.question },
                { role: 'assistant', content: msg.answer }
            ]),
            { role: 'user', content: question }
        ];
        // Llama a la IA externa con el contexto
        const answer = await getAIAnswer(messages);
        // Guarda en historial
        const dataCreate = await this.service.create({ conversation_id: conversation.id, question, answer });
        if (dataCreate) {
            return ApiResponse.success(res, { data: dataCreate, conversation_id: conversation.id, route: this.routes, message: 'AI answer generated' });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });
    // Obtener conversaciones del usuario
    static getConversationUser = catchErrors(async (req, res, next) => {
        const { user_id } = req.params;
        const conversations = await this.serviceConversation.findAll({ where: { user_id }, include: this.includesConversation });
        if (conversations) {
            return ApiResponse.success(res, { data: conversations, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'Conversation not found', route: this.routes, status: 404 });
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
