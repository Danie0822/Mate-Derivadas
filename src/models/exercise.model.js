const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class Exercise extends BaseEntity {
    static associate(models) {
        this.hasMany(models.UserExercise, {
            foreignKey: 'exercise_id',
            as: 'userExercises'
        });
    }
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
                difficulty: {
                    type: DataTypes.ENUM('easy', 'medium', 'hard'),
                    allowNull: false,
                    defaultValue: 'easy'
                },
                content: {
                    type: DataTypes.JSONB,
                    allowNull: false
                },
                solution: {
                    type: DataTypes.JSONB,
                    allowNull: true
                },
                topic: {
                    type: DataTypes.STRING(255),
                    allowNull: true
                },
                tags: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                    defaultValue: []
                }
            },
            {
                sequelize,
                modelName: 'Exercise',
                tableName: 'exercises'
            }
        );
    }
}

module.exports = Exercise;
