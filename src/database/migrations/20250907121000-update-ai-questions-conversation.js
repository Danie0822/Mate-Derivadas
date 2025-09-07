'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Eliminar user_id
    const table = await queryInterface.describeTable('ai_questions');
    if (table.user_id) {
      await queryInterface.removeColumn('ai_questions', 'user_id');
    }
    // Agregar conversation_id
    await queryInterface.addColumn('ai_questions', 'conversation_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'conversations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Revertir cambios
    await queryInterface.removeColumn('ai_questions', 'conversation_id');
    await queryInterface.addColumn('ai_questions', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
