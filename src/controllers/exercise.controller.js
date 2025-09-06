const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { Exercise } = require('../models');

class ExerciseController {
    static service = new CrudService(Exercise);
    static routes = '/exercises';

    static save = catchErrors(async (req, res, next) => {
        const dataCreate = await this.service.create(req.body);
        if (dataCreate) {
            return ApiResponse.success(res, { data: dataCreate, route: this.routes, message: 'Exercise created' });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });

    static update = catchErrors(async (req, res, next) => {
        const dataUpdate = await this.service.update(req.params.id, req.body);
        if (dataUpdate) {
            return ApiResponse.success(res, { data: dataUpdate, route: this.routes, message: 'Exercise updated' });
        }
        return ApiResponse.error(res, { error: 'Exercise not found', route: this.routes });
    });

    static getAll = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll();
        return ApiResponse.success(res, { data, route: this.routes, message: 'Exercise list' });
    });

    static getById = catchErrors(async (req, res, next) => {
        const data = await this.service.findById(req.params.id);
        if (data) {
            return ApiResponse.success(res, { data, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'Exercise not found', route: this.routes, status: 404 });
    });

    static destroy = catchErrors(async (req, res, next) => {
        const success = await this.service.delete(req.params.id);
        if (success) {
            return ApiResponse.success(res, { route: this.routes, message: 'Exercise deleted' });
        }
        return ApiResponse.error(res, { error: 'Exercise not found', route: this.routes, status: 404 });
    });
}

module.exports = ExerciseController;
