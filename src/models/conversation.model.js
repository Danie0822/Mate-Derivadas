const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');


class Conversation extends BaseEntity {
  static initModel(sequelize) {
    super.init(
      {
        user_id: {
          type: DataTypes.UUID,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
          validate: {
            len: [1, 255]
          }
        },
        is_favorite: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      },
      {
        sequelize,
        modelName: 'Conversation',
        tableName: 'conversations',
        timestamps: true, // Habilita created_at y updated_at
        updatedAt: 'updated_at',
        createdAt: 'created_at'
      }
    );
  }

  static associate(models) {
    Conversation.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Conversation.hasMany(models.AIQuestion, { foreignKey: 'conversation_id', as: 'aiQuestions' });
  }
}

module.exports = Conversation;

