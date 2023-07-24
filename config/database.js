import { Sequelize } from "sequelize";

const db = new Sequelize('api_laravel', 'root', '',{
      host: 'localhost',
      dialect: 'mysql'
});

export default db;