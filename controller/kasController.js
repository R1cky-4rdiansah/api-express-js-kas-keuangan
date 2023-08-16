import Kas from "../models/Kas.js";
import fs from "fs";
import { Op, Sequelize } from "sequelize";
import Gambar from "../models/gambarModel.js";

export const getKas = async (req, res) => {
  try {
    const data_kas = await Kas.findAll({
      order: [["created_at", "desc"]],
      limit: 10,
    });

    var data_tgl_grafik = [];
    var data_grafik_nilai = [];
    var data_grafik_pemasukkan = [];
    var data_grafik_pengeluaran = [];

    data_kas.map((item) => {
      data_tgl_grafik.push(item.tanggal);
      data_grafik_nilai.push(item.saldo);
      data_grafik_pemasukkan.push(item.pemasukkan);
      data_grafik_pengeluaran.push(item.pengeluaran);
    });

    const data_pemasukkan = await Kas.findAll({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              "CASE WHEN pemasukkan != 0 THEN pemasukkan ELSE 0 END"
            )
          ),
          "jml_pemasukkan",
        ],
      ],
      where: {
        pemasukkan: {
          [Op.ne]: 0,
        },
      },
    });

    const dataPemasukkan = Object.values(data_pemasukkan[0]);

    const data_pengeluaran = await Kas.findAll({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              "CASE WHEN pengeluaran != 0 THEN pengeluaran ELSE 0 END"
            )
          ),
          "jml_pengeluaran",
        ],
      ],
      where: {
        pengeluaran: {
          [Op.ne]: 0,
        },
      },
    });

    var dataPengeluaran = Object.values(data_pengeluaran[0]);

    var data_saldo = await Kas.findOne({
      attributes: ["saldo"],
      order: [["id_kas", "desc"]],
    });

    if(!data_saldo){
      data_saldo = {saldo : 0};
    }

    res.status(200).json({
      message: "Data semua produk",
      success: true,
      data: data_kas,
      data_saldo: data_saldo,
      data_pemasukkan: dataPemasukkan,
      data_pengeluaran: dataPengeluaran,
      data_tgl_grafik: data_tgl_grafik,
      data_grafik_nilai: data_grafik_nilai,
      data_grafik_pemasukkan: data_grafik_pemasukkan,
      data_grafik_pengeluaran: data_grafik_pengeluaran,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const report_saldo = async (req, res) => {
  try {
    const { tanggal1, tanggal2 } = req.body;

    if (tanggal1 && tanggal2) {
      var response = await Kas.findAll({
        where: {
          tanggal: {
            [Op.gte]: tanggal1,
            [Op.lte]: tanggal2,
          },
        },
        order: [["created_at", "desc"]],
      });
    } else {
      var response = await Kas.findAll({
        order: [["created_at", "desc"]],
      });
    }
    res.status(200).json({
      message: "Detail produk",
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const report_pemasukkan = async (req, res) => {
  try {
    const { tanggal1, tanggal2 } = req.body;

    if (tanggal1 && tanggal2) {
      var response = await Kas.findAll({
        where: {
          pemasukkan: {
            [Op.ne]: 0,
          },
          tanggal: {
            [Op.gte]: tanggal1,
            [Op.lte]: tanggal2,
          },
        },
        order: [["created_at", "desc"]],
      });
    } else {
      var response = await Kas.findAll({
        where: {
          pemasukkan: {
            [Op.ne]: 0,
          },
        },
        order: [["created_at", "desc"]],
      });
    }
    res.status(200).json({
      message: "Detail produk",
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const report_pengeluaran = async (req, res) => {
  try {
    const { tanggal1, tanggal2 } = req.body;

    if (tanggal1 && tanggal2) {
      var response = await Kas.findAll({
        where: {
          pengeluaran: {
            [Op.ne]: 0,
          },
          tanggal: {
            [Op.gte]: tanggal1,
            [Op.lte]: tanggal2,
          },
        },
        order: [["created_at", "desc"]],
      });
    } else {
      var response = await Kas.findAll({
        where: {
          pengeluaran: {
            [Op.ne]: 0,
          },
        },
        order: [["created_at", "desc"]],
      });
    }
    res.status(200).json({
      message: "Detail produk",
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const input_kas = async (req, res) => {
  try {
    var { deskripsi, pemasukkan, pengeluaran, tanggal } = req.body;

    const gambar = req.files;

    if (!pemasukkan) {
      pemasukkan = 0;
    }

    if (!pengeluaran) {
      pengeluaran = 0;
    }

    const save = await Kas.create({
      deskripsi: deskripsi,
      tanggal: tanggal,
      pemasukkan: pemasukkan,
      pengeluaran: pengeluaran,
      created_at: new Date(),
      updated_at: new Date(),
    });

    gambar.forEach((file) => {
      Gambar.create({
        id_kas: save.id_kas,
        gambar: file.filename,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    let data_pemasukkan = await Kas.findAll({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              "CASE WHEN pemasukkan != 0 THEN pemasukkan ELSE 0 END"
            )
          ),
          "jml_pemasukkan",
        ],
      ],
      where: {
        pemasukkan: {
          [Op.ne]: 0,
        },
      },
    });

    let data_pengeluaran = await Kas.findAll({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              "CASE WHEN pengeluaran != 0 THEN pengeluaran ELSE 0 END"
            )
          ),
          "jml_pengeluaran",
        ],
      ],
      where: {
        pengeluaran: {
          [Op.ne]: 0,
        },
      },
    });

    var JmlPemasukkan = parseInt(
      Object.values(data_pemasukkan[0])[0].jml_pemasukkan
    );
    var JmlPengeluaran = parseInt(
      Object.values(data_pengeluaran[0])[0].jml_pengeluaran
    );

    if (!JmlPemasukkan) {
      JmlPemasukkan = 0;
    }

    if (!JmlPengeluaran) {
      JmlPengeluaran = 0;
    }

    const kas_saldo = JmlPemasukkan - JmlPengeluaran;

    await Kas.update(
      {
        saldo: kas_saldo,
      },
      {
        where: {
          id_kas: save.id_kas,
        },
      }
    );

    res.status(200).json({
      message: "Simpan Data Produk",
      success: true,
      data: save,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const showGambar = async (req, res) => {
  const idKas = req.params.id;

  try {
    const response = await Gambar.findAll({
      where: {
        id_kas: idKas,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Data Gambar",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const update_kas = async (req, res) => {
  try {
    var { deskripsi, pemasukkan, pengeluaran } = req.body;

    if (!pemasukkan) {
      pemasukkan = 0;
    }

    if (!pengeluaran) {
      pengeluaran = 0;
    }

    const data_awal = await Kas.findAll({
      where: {
        id_kas: req.params.id,
      },
    });

    const data_gte = await Kas.findAll({
      where: {
        id_kas: {
          [Op.gte]: req.params.id,
        },
      },
    });

    const pemasukkan_awal = data_awal[0].pemasukkan;
    const pengeluaran_awal = data_awal[0].pengeluaran;

    if (req.files.length != 0) {
      await Kas.update(
        {
          deskripsi: deskripsi,
          pemasukkan: pemasukkan,
          pengeluaran: pengeluaran,
          updated_at: new Date(),
        },
        {
          where: {
            id_kas: req.params.id,
          },
        }
      );

      const gambar = req.files;
      gambar.forEach((file) => {
        Gambar.create({
          id_kas: req.params.id,
          gambar: file.filename,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    } else {
      await Kas.update(
        {
          deskripsi: deskripsi,
          pemasukkan: pemasukkan,
          pengeluaran: pengeluaran,
          updated_at: new Date(),
        },
        {
          where: {
            id_kas: req.params.id,
          },
        }
      );
    }

    var tambah_saldo = 0;

    if (pemasukkan != 0) {
      if (pemasukkan > pemasukkan_awal) {
        tambah_saldo = pemasukkan - pemasukkan_awal;
      } else if (pemasukkan < pemasukkan_awal) {
        tambah_saldo = -1 * (pemasukkan_awal - pemasukkan);
      }
    }

    if (pengeluaran != 0) {
      if (pengeluaran < pengeluaran_awal) {
        tambah_saldo = pengeluaran_awal - pengeluaran;
      } else if (pengeluaran > pengeluaran_awal) {
        tambah_saldo = -1 * (pengeluaran - pengeluaran_awal);
      }
    }

    data_gte.map(async (item) => {
      await Kas.update(
        {
          saldo: item.saldo + tambah_saldo,
        },
        {
          where: {
            id_kas: item.id_kas,
          },
        }
      );
    });

    res.status(200).json({
      message: "Update data Kas berhasil",
      success: true,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const hapus_kas = async (req, res) => {
  try {
    const data_awal = await Kas.findAll({
      where: {
        id_kas: req.params.id,
      },
    });

    const data_gte = await Kas.findAll({
      where: {
        id_kas: {
          [Op.gt]: req.params.id,
        },
      },
    });

    const pemasukkan_awal = data_awal[0].pemasukkan;
    const pengeluaran_awal = data_awal[0].pengeluaran;

    var tambah_saldo = 0;

    if (pemasukkan_awal != 0) {
      tambah_saldo = -1 * pemasukkan_awal;
    }

    if (pengeluaran_awal != 0) {
      tambah_saldo = pengeluaran_awal;
    }

    data_gte.map(async (item) => {
      await Kas.update(
        {
          saldo: item.saldo + tambah_saldo,
        },
        {
          where: {
            id_kas: item.id_kas,
          },
        }
      );
    });

    const gambarAwal = await Gambar.findAll({
      where: {
        id_kas: req.params.id,
      },
    });

    gambarAwal.forEach((item) => {
      if (fs.existsSync("./public/bukti_kas/" + item.gambar)) {
        fs.unlinkSync("./public/bukti_kas/" + item.gambar);
      }
    });

    await Kas.destroy({
      where: {
        id_kas: req.params.id,
      },
    });

    await Gambar.destroy({
      where: {
        id_kas: req.params.id,
      },
    });

    res.status(200).json({
      message: "Hapus data Kas berhasil",
      success: true,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const hapus_gambar = async (req, res) => {
  try {

    const data_awal = await Gambar.findAll({
      where: {
        id: req.params.id,
      },
    });

    if (fs.existsSync("./public/bukti_kas/" + data_awal[0].gambar)) {
      fs.unlinkSync("./public/bukti_kas/" + data_awal[0].gambar);
    }

    await Gambar.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "Hapus data Gambar berhasil",
      success: true,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
