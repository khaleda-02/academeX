'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('pending', 'active', 'des_active'),
        allowNull: false,
        defaultValue: 'pending',
      },
      otp: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      otp_expiry: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      roles: {
        allowNull: false,
        type: Sequelize.ENUM('admin', 'super_admin', 'user'),
        defaultValue: 'user',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_by: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deleted_by: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  },
};
