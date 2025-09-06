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
          allowNull: true
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
