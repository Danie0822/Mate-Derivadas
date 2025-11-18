'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Check if column exists before adding it
      const tableInfo = await queryInterface.describeTable('conversations');
      
      // Add is_chat_ia column if it doesn't exist
      if (!tableInfo.is_chat_ia) {
        await queryInterface.addColumn('conversations', 'is_chat_ia', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        }, { transaction });
        
        console.log('Added is_chat_ia column to conversations table');
      } else {
        console.log('is_chat_ia column already exists in conversations table');
      }
      
      // Add composite index for better performance when filtering chat conversations
      try {
        await queryInterface.addIndex('conversations', ['user_id', 'is_chat_ia', 'updated_at'], {
          name: 'idx_conversations_user_chat_updated',
          transaction
        });
        console.log('Added composite index for chat conversations');
      } catch (error) {
        // Index might already exist, ignore error
        console.log('Index idx_conversations_user_chat_updated already exists or failed to create:', error.message);
      }
      
      await transaction.commit();
      console.log('Add is_chat_ia to conversations table migration completed successfully');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove composite index
      try {
        await queryInterface.removeIndex('conversations', 'idx_conversations_user_chat_updated', { transaction });
        console.log('Removed composite index for chat conversations');
      } catch (error) {
        console.log('Index idx_conversations_user_chat_updated does not exist or failed to remove:', error.message);
      }
      
      // Remove column
      const tableInfo = await queryInterface.describeTable('conversations');
      
      if (tableInfo.is_chat_ia) {
        await queryInterface.removeColumn('conversations', 'is_chat_ia', { transaction });
        console.log('Removed is_chat_ia column from conversations table');
      } else {
        console.log('is_chat_ia column does not exist in conversations table');
      }
      
      await transaction.commit();
      console.log('Rollback is_chat_ia from conversations table completed successfully');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Rollback failed:', error);
      throw error;
    }
  }
};