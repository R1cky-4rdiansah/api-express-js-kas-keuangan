import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Products = db.define('products', {
      id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
      },
      gambar: {
            type: Sequelize.STRING
      },
      judul: {
            type: Sequelize.STRING
      },
      harga: {
            type: Sequelize.INTEGER
      },
      deskripsi: {
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

export default Products;

(async() => {
      await db.sync();
})();
