'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Check if columns exist before adding them
      const tableInfo = await queryInterface.describeTable('conversations');
      
      // Add name column if it doesn't exist
      if (!tableInfo.name) {
        await queryInterface.addColumn('conversations', 'name', {
          type: Sequelize.STRING,
          allowNull: true,
        }, { transaction });
      }
      
      // Add is_favorite column if it doesn't exist
      if (!tableInfo.is_favorite) {
        await queryInterface.addColumn('conversations', 'is_favorite', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        }, { transaction });
      }
      
      // Add indexes for better performance
      try {
        await queryInterface.addIndex('conversations', ['user_id', 'is_favorite'], {
          name: 'idx_conversations_user_favorite',
          transaction
        });
      } catch (error) {
        // Index might already exist, ignore error
        console.log('Index idx_conversations_user_favorite already exists or failed to create:', error.message);
      }
      
      try {
        await queryInterface.addIndex('conversations', ['user_id', 'updated_at'], {
          name: 'idx_conversations_user_updated',
          transaction
        });
      } catch (error) {
        // Index might already exist, ignore error
        console.log('Index idx_conversations_user_updated already exists or failed to create:', error.message);
      }
      
      try {
        await queryInterface.addIndex('conversations', ['updated_at'], {
          name: 'idx_conversations_updated_at',
          transaction
        });
      } catch (error) {
        // Index might already exist, ignore error
        console.log('Index idx_conversations_updated_at already exists or failed to create:', error.message);
      }
      
      await transaction.commit();
      console.log('Conversations table migration completed successfully');
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove indexes
      try {
        await queryInterface.removeIndex('conversations', 'idx_conversations_updated_at', { transaction });
      } catch (error) {
        console.log('Index idx_conversations_updated_at does not exist or failed to remove:', error.message);
      }
      
      try {
        await queryInterface.removeIndex('conversations', 'idx_conversations_user_updated', { transaction });
      } catch (error) {
        console.log('Index idx_conversations_user_updated does not exist or failed to remove:', error.message);
      }
      
      try {
        await queryInterface.removeIndex('conversations', 'idx_conversations_user_favorite', { transaction });
      } catch (error) {
        console.log('Index idx_conversations_user_favorite does not exist or failed to remove:', error.message);
      }
      
      // Remove columns
      const tableInfo = await queryInterface.describeTable('conversations');
      
      if (tableInfo.is_favorite) {
        await queryInterface.removeColumn('conversations', 'is_favorite', { transaction });
      }
      
      if (tableInfo.name) {
        await queryInterface.removeColumn('conversations', 'name', { transaction });
      }
      
      await transaction.commit();
      console.log('Conversations table rollback completed successfully');
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};