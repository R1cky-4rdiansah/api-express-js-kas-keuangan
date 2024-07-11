import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Users = db.define('users', {
      id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
      },
      name: {
            type: Sequelize.STRING
      },
      email: {
            type: Sequelize.STRING
      },
      email_verified_at: {
            type: Sequelize.STRING
      },
      username: {
            type: Sequelize.STRING
      },
      level: {
            type: Sequelize.STRING
      },
      password: {
            type: Sequelize.STRING
      },
      remember_token: {
            type: Sequelize.STRING
      },
      created_at: {
            type: Sequelize.DATE
      },
      updated_at: {
            type: Sequelize.DATE
      },
}, {
      freezeTableName: true,
      timestamps: false
})

export default Users;

(async() => {
      await db.sync()
})();