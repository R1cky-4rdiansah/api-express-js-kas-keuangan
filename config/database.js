import { Sequelize } from "sequelize";

const db = new Sequelize('kas_node_js', 'root', '',{
      host: 'localhost',
      dialect: 'mysql'
});

export default db;