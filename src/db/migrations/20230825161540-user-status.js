'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'verified', {
      type: Sequelize.ENUM('pending', 'active', 'desactive'),
      allowNull: false,
      defaultValue: 'pending',
    });

    await queryInterface.renameColumn('Users', 'verified', 'status');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'status', 'verified');

    await queryInterface.changeColumn('Users', 'verified', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
