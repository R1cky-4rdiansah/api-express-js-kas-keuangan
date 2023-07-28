import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Kas = db.define(
  "kas",
  {
    id_kas: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    gambar: {
      type: Sequelize.STRING,
    },
    tanggal: {
      type: Sequelize.DATEONLY,
    },
    saldo: {
      type: Sequelize.BIGINT,
    },
    pemasukkan: {
      type: Sequelize.BIGINT,
    },
    pengeluaran: {
      type: Sequelize.BIGINT,
    },
    deskripsi: {
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

export default Kas;

(async() => {
      await db.sync();
})();
