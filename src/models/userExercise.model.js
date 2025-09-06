const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class UserExercise extends BaseEntity {
    static initModel(sequelize) {
        super.init(
            {
                user_id: {
                    type: DataTypes.UUID,
                    allowNull: false
                },
                exercise_id: {
                    type: DataTypes.UUID,
                    allowNull: false
                },
                answer: {
                    type: DataTypes.JSONB,
                    allowNull: true
                },
                is_correct: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                answered_at: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: 'UserExercise',
                tableName: 'user_exercises'
            }
        );
    }
}

module.exports = UserExercise;
