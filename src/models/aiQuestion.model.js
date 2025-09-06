const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class AIQuestion extends BaseEntity {
    static initModel(sequelize) {
        super.init(
            {
                user_id: {
                    type: DataTypes.UUID,
                    allowNull: false
                },
                question: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                answer: {
                    type: DataTypes.TEXT,
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: 'AIQuestion',
                tableName: 'ai_questions'
            }
        );
    }
}

module.exports = AIQuestion;
