const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');


class AIQuestion extends BaseEntity {
    static initModel(sequelize) {
        super.init(
            {
                conversation_id: {
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

    static associate(models) {
        AIQuestion.belongsTo(models.Conversation, { foreignKey: 'conversation_id', as: 'conversation' });
    }
}

module.exports = AIQuestion;
