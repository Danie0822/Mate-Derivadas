
const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { AIQuestion, Conversation, User } = require('../models');
const { getAIAnswer } = require('../services/aiService');
const ChatNameService = require('../services/chatNameService');


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

    // req.body: { user_id, question, conversation_id?, is_chat_ia, disable_latex? }
    static ask = catchErrors(async (req, res, next) => {
        const { user_id, question, conversation_id, is_chat_ia, disable_latex } = req.body;
        let conversation;
        let isNewConversation = false;
        
        // Buscar la conversación existente o crear una nueva
        if (conversation_id !== undefined && conversation_id !== null) {
            conversation = await this.serviceConversation.findById(conversation_id);
            if (conversation === null) {
                return ApiResponse.error(res, { error: 'Conversation not found', route: this.routes, status: 404 });
            }
        } else {
            // Crear nueva conversación
            isNewConversation = true;
            conversation = await this.serviceConversation.create({ 
                user_id, 
                is_chat_ia,
                name: 'Nueva Conversación' // Nombre temporal
            });
        }

        // Obtener historial de mensajes de la conversación
        const history = await this.service.findAll({
            where: { conversation_id: conversation.id },
            order: [['created_at', 'ASC']]
        });
        
        // Construir el contexto para la IA
        let systemPrompt;
        if (disable_latex) {
            // Prompt para verificaciones de ejercicios (sin LaTeX)
            systemPrompt = 'Eres un profesor experto en matemáticas especializado en cálculo y derivadas. Responde SIEMPRE en español de forma clara y directa. IMPORTANTE: NO uses formato LaTeX ni símbolos especiales. Escribe en texto plano: usa "pi" en lugar de π, "^2" para exponentes, "/" para fracciones. Ejemplo correcto: "La velocidad en t = pi/2 es 0 m/s y la aceleracion es -5 m/s^2".';
        } else {
            // Prompt normal (con LaTeX)
            systemPrompt = 'Eres un profesor experto en matemáticas especializado en cálculo y derivadas. Responde SIEMPRE en español de forma clara y didáctica. REGLAS ESTRICTAS para matemáticas: 1) Usa LaTeX OBLIGATORIAMENTE: variables como $x$, $y$, funciones como $f(x)$, derivadas como $\\frac{dy}{dx}$ o $f\'(x)$, potencias como $x^2$, fracciones como $\\frac{a}{b}$. 2) Para ecuaciones importantes usa formato bloque: $$ecuación$$. 3) Nunca escribas matemáticas en texto plano. 4) Ejemplos correctos: "La derivada de $x^2$ es $2x$", "$$\\frac{d}{dx}(x^3) = 3x^2$$". 5) Explica paso a paso con ejemplos prácticos.';
        }
        
        const messages = [
            { role: 'system', content: systemPrompt },
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
        
        // Si es una nueva conversación de chat IA, generar nombre basado en configuración
        if (isNewConversation && is_chat_ia) {
            try {
                let chatName;
                const generateChatName = process.env.GENERAR_NOMBRE_CHAT_IA === 'true';
                
                if (generateChatName) {
                    chatName = await ChatNameService.generateChatName(question);
                } else {
                    // Usar la primera pregunta como nombre (limitada a 50 caracteres)
                    chatName = question.length > 50 ? question.substring(0, 50) + '...' : question;
                }
                
                await this.serviceConversation.update(conversation.id, { name: chatName });
                conversation.name = chatName;
            } catch (error) {
                console.error('Error setting chat name:', error);
            }
        }
        
        if (dataCreate) {
            return ApiResponse.success(res, { 
                data: dataCreate, 
                conversation_id: conversation.id,
                conversation_name: conversation.name,
                route: this.routes, 
                message: 'AI answer generated' 
            });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });
    // Obtener conversaciones del usuario (solo chat IA)
    static getConversationUser = catchErrors(async (req, res, next) => {
        const { user_id } = req.params;
        const conversations = await this.serviceConversation.findAll({ 
            where: { user_id, is_chat_ia: true }, 
            include: this.includesConversation,
            order: [['updated_at', 'DESC']] // Mostrar las más recientes primero
        });
        if (conversations) {
            return ApiResponse.success(res, { data: conversations, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'No chat conversations found', route: this.routes, status: 404 });
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

    // Obtener historial de mensajes de una conversación específica
    static getConversationHistory = catchErrors(async (req, res, next) => {
        const { conversation_id } = req.params;
        
        // Verificar que la conversación existe
        const conversation = await this.serviceConversation.findById(conversation_id);
        if (!conversation) {
            return ApiResponse.error(res, { 
                error: 'Conversation not found', 
                route: this.routes, 
                status: 404 
            });
        }

        // Obtener historial de mensajes ordenado por fecha de creación
        const messages = await this.service.findAll({
            where: { conversation_id },
            order: [['created_at', 'ASC']],
            attributes: ['id', 'question', 'answer', 'created_at']
        });

        return ApiResponse.success(res, { 
            data: {
                conversation,
                messages 
            },
            route: this.routes,
            message: 'Conversation history retrieved successfully'
        });
    });
}

module.exports = AIQuestionController;
