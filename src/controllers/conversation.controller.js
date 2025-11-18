const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { Conversation, AIQuestion } = require('../models');

class ConversationController {
    static service = new CrudService(Conversation);
    static routes = '/conversations';

    static updateName = catchErrors(async (req, res, next) => {
        const { id } = req.params;
        const { name } = req.body;

        const conversation = await this.service.findById(id);
        if (!conversation) {
            return ApiResponse.error(res, { 
                error: 'Conversación no encontrada', 
                route: this.routes, 
                status: 404 
            });
        }

        const updatedConversation = await this.service.update(id, { name });
        
        return ApiResponse.success(res, { 
            data: updatedConversation, 
            route: this.routes, 
            message: 'Nombre de conversación actualizado exitosamente' 
        });
    });

    static toggleFavorite = catchErrors(async (req, res, next) => {
        const { id } = req.params;
        const { is_favorite } = req.body;

        const conversation = await this.service.findById(id);
        if (!conversation) {
            return ApiResponse.error(res, { 
                error: 'Conversación no encontrada', 
                route: this.routes, 
                status: 404 
            });
        }

        const updatedConversation = await this.service.update(id, { is_favorite });
        
        return ApiResponse.success(res, { 
            data: updatedConversation, 
            route: this.routes, 
            message: `Conversación ${is_favorite ? 'marcada como favorita' : 'desmarcada como favorita'}` 
        });
    });

    static delete = catchErrors(async (req, res, next) => {
        const { id } = req.params;

        const conversation = await this.service.findById(id);
        if (!conversation) {
            return ApiResponse.error(res, { 
                error: 'Conversación no encontrada', 
                route: this.routes, 
                status: 404 
            });
        }

        // Primero eliminar todas las preguntas AI asociadas
        await AIQuestion.destroy({ where: { conversation_id: id } });
        
        // Luego eliminar la conversación
        await this.service.delete(id);
        
        return ApiResponse.success(res, { 
            route: this.routes, 
            message: 'Conversación eliminada exitosamente' 
        });
    });
}

module.exports = ConversationController;