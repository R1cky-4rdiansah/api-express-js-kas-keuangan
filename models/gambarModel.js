import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Gambar = db.define(
  "gambar_kas",
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    id_kas: {
      type: Sequelize.BIGINT,
    },
    gambar: {
      type: Sequelize.STRING,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Gambar;

(async() => {
      await db.sync();
})();
