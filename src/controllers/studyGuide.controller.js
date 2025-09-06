const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { StudyGuide } = require('../models');

class StudyGuideController {
  static service = new CrudService(StudyGuide);
  static routes = '/study-guides';

  static save = catchErrors(async (req, res, next) => {
    const dataCreate = await this.service.create(req.body);
    if (dataCreate) {
      return ApiResponse.success(res, { data: dataCreate, route: this.routes, message: 'StudyGuide created' });
    }
    return ApiResponse.error(res, { dataCreate, route: this.routes });
  });

  static update = catchErrors(async (req, res, next) => {
    const dataUpdate = await this.service.update(req.params.id, req.body);
    if (dataUpdate) {
      return ApiResponse.success(res, { data: dataUpdate, route: this.routes, message: 'StudyGuide updated' });
    }
    return ApiResponse.error(res, { error: 'StudyGuide not found', route: this.routes });
  });

  static getAll = catchErrors(async (req, res, next) => {
    const data = await this.service.findAll();
    return ApiResponse.success(res, { data, route: this.routes, message: 'StudyGuide list' });
  });

  static getById = catchErrors(async (req, res, next) => {
    const data = await this.service.findById(req.params.id);
    if (data) {
      return ApiResponse.success(res, { data, route: this.routes });
    }
    return ApiResponse.error(res, { error: 'StudyGuide not found', route: this.routes, status: 404 });
  });

  static destroy = catchErrors(async (req, res, next) => {
    const success = await this.service.delete(req.params.id);
    if (success) {
      return ApiResponse.success(res, { route: this.routes, message: 'StudyGuide deleted' });
    }
    return ApiResponse.error(res, { error: 'StudyGuide not found', route: this.routes, status: 404 });
  });
}

module.exports = StudyGuideController;
