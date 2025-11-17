'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar si las columnas existen antes de agregarlas
    const tableDescription = await queryInterface.describeTable('conversations');
    
    if (!tableDescription.name) {
      await queryInterface.addColumn('conversations', 'name', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Nombre de la conversación generado automáticamente o personalizado por el usuario'
      });
    }

    if (!tableDescription.is_favorite) {
      await queryInterface.addColumn('conversations', 'is_favorite', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indica si la conversación está marcada como favorita'
      });
    }

    // La columna updated_at ya existe, solo agregamos índices si no existen
    try {
      await queryInterface.addIndex('conversations', ['user_id', 'is_favorite'], {
        name: 'idx_conversations_user_favorite'
      });
    } catch (error) {
      console.log('Index idx_conversations_user_favorite already exists or failed to create');
    }

    try {
      await queryInterface.addIndex('conversations', ['user_id', 'updated_at'], {
        name: 'idx_conversations_user_updated'
      });
    } catch (error) {
      console.log('Index idx_conversations_user_updated already exists or failed to create');
    }

    try {
      await queryInterface.addIndex('conversations', ['updated_at'], {
        name: 'idx_conversations_updated_at'
      });
    } catch (error) {
      console.log('Index idx_conversations_updated_at already exists or failed to create');
    }
  },

  async down(queryInterface, Sequelize) {
    // Eliminar índices primero
    await queryInterface.removeIndex('conversations', 'idx_conversations_updated_at');
    await queryInterface.removeIndex('conversations', 'idx_conversations_user_updated');
    await queryInterface.removeIndex('conversations', 'idx_conversations_user_favorite');

    // Eliminar columnas
    await queryInterface.removeColumn('conversations', 'updated_at');
    await queryInterface.removeColumn('conversations', 'is_favorite');
    await queryInterface.removeColumn('conversations', 'name');
  }
};