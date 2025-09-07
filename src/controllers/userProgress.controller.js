const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { UserProgress, StudyGuide, User } = require('../models');

class UserProgressController {
    static service = new CrudService(UserProgress);
    static routes = '/user-progress';
    
    static include = [{
        model: User,
        as: 'user',
        attributes: ['id', 'full_name']
    },
    {
        model: StudyGuide,
        as: 'studyGuide',
        attributes: ['id', 'title']
    }
    ];
    static save = catchErrors(async (req, res, next) => {
        const dataCreate = await this.service.create(req.body);
        if (dataCreate) {
            return ApiResponse.success(res, { data: dataCreate, route: this.routes, message: 'UserProgress created' });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });

    static update = catchErrors(async (req, res, next) => {
        const dataUpdate = await this.service.update(req.params.id, req.body);
        if (dataUpdate) {
            return ApiResponse.success(res, { data: dataUpdate, route: this.routes, message: 'UserProgress updated' });
        }
        return ApiResponse.error(res, { error: 'UserProgress not found', route: this.routes });
    });

    static getAll = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll({ include: this.include });
        return ApiResponse.success(res, { data, route: this.routes, message: 'UserProgress list' });
    });

    static getById = catchErrors(async (req, res, next) => {
        const data = await this.service.findById(req.params.id, { include: this.include });
        if (data) {
            return ApiResponse.success(res, { data, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'UserProgress not found', route: this.routes, status: 404 });
    });

    static destroy = catchErrors(async (req, res, next) => {
        const success = await this.service.delete(req.params.id);
        if (success) {
            return ApiResponse.success(res, { route: this.routes, message: 'UserProgress deleted' });
        }
        return ApiResponse.error(res, { error: 'UserProgress not found', route: this.routes, status: 404 });
    });
}

module.exports = UserProgressController;
