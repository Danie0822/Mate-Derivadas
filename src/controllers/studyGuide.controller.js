const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { StudyGuide, Exercise } = require('../models');

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

  // Método para obtener ejercicios relacionados con una guía de estudio
  static getRelatedExercises = catchErrors(async (req, res, next) => {
    const studyGuide = await this.service.findById(req.params.id);
    
    if (!studyGuide) {
      return ApiResponse.error(res, { error: 'StudyGuide not found', route: this.routes, status: 404 });
    }

    // Si no hay ejercicios definidos, retornar array vacío
    if (!studyGuide.exercises || !Array.isArray(studyGuide.exercises) || studyGuide.exercises.length === 0) {
      return ApiResponse.success(res, { 
        data: [], 
        route: this.routes, 
        message: 'No exercises found for this study guide' 
      });
    }

    try {
      // Extraer los IDs de ejercicios del array
      const exerciseIds = studyGuide.exercises
        .filter(ex => ex.exercise_id) // Filtrar solo los que tienen exercise_id
        .map(ex => ex.exercise_id);

      if (exerciseIds.length === 0) {
        return ApiResponse.success(res, { 
          data: [], 
          route: this.routes, 
          message: 'No valid exercise IDs found' 
        });
      }

      // Buscar los ejercicios por sus IDs
      const exercises = await Exercise.findAll({
        where: {
          id: exerciseIds
        },
        order: [['created_at', 'ASC']]
      });

      // Combinar la información del ejercicio con los metadatos de la guía
      const exercisesWithMetadata = exercises.map(exercise => {
        const metadata = studyGuide.exercises.find(ex => ex.exercise_id === exercise.id);
        return {
          ...exercise.toJSON(),
          // Añadir metadatos de la guía de estudio
          order: metadata?.order || 0,
          required: metadata?.required || false,
          notes: metadata?.notes || null
        };
      });

      // Ordenar por el campo 'order' si existe
      exercisesWithMetadata.sort((a, b) => (a.order || 0) - (b.order || 0));

      return ApiResponse.success(res, { 
        data: exercisesWithMetadata, 
        route: this.routes, 
        message: 'Related exercises retrieved successfully' 
      });

    } catch (error) {
      console.error('Error fetching related exercises:', error);
      return ApiResponse.error(res, { 
        error: 'Error fetching related exercises', 
        route: this.routes, 
        status: 500 
      });
    }
  });
}

module.exports = StudyGuideController;
