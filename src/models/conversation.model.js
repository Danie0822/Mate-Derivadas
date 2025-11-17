const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');


class Conversation extends BaseEntity {
  static initModel(sequelize) {
    super.init(
      {
        user_id: {
          type: DataTypes.UUID,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Conversation',
        tableName: 'conversations'
      }
    );
  }

  static associate(models) {
    Conversation.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Conversation.hasMany(models.AIQuestion, { foreignKey: 'conversation_id', as: 'aiQuestions' });
  }
}

module.exports = Conversation;

