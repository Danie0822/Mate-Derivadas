const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { AIQuestion } = require('../models');
const { getAIAnswer } = require('../services/aiService');

class AIQuestionController {
    static service = new CrudService(AIQuestion);
    static routes = '/ai-questions';

    static ask = catchErrors(async (req, res, next) => {
        const { user_id, question } = req.body;
        // Llama a la IA externa
        const answer = await getAIAnswer(question);
        // Guarda en historial
        const dataCreate = await this.service.create({ user_id, question, answer });
        if (dataCreate) {
            return ApiResponse.success(res, { data: dataCreate, route: this.routes, message: 'AI answer generated' });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });

    static getAll = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll();
        return ApiResponse.success(res, { data, route: this.routes, message: 'AIQuestion list' });
    });

    static getById = catchErrors(async (req, res, next) => {
        const data = await this.service.findById(req.params.id);
        if (data) {
            return ApiResponse.success(res, { data, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'AIQuestion not found', route: this.routes, status: 404 });
    });
}

module.exports = AIQuestionController;
