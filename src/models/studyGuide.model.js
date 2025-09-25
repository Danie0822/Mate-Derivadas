const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class StudyGuide extends BaseEntity {
  static initModel(sequelize) {
    super.init(
      {
        title: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        // Campos originales del compañero (organización temporal)
        week: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        day: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        resources: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Recursos externos: videos, links, PDFs'
        },
        // Campos híbridos añadidos (categorización educativa)
        topic: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: 'Tema o categoría de la guía'
        },
        level: {
          type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
          allowNull: true,
          defaultValue: 'beginner',
          comment: 'Nivel de dificultad'
        },
        tags: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: [],
          comment: 'Etiquetas para búsqueda'
        },
        content: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Contenido educativo interno'
        },
        exercises: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: [],
          comment: 'Referencias a ejercicios relacionados'
        }
      },
      {
        sequelize,
        modelName: 'StudyGuide',
        tableName: 'study_guides'
      }
    );
  }
}

module.exports = StudyGuide;
