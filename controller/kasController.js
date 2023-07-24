import Kas from "../models/Kas.js";
import fs from 'fs'
import { Op, Sequelize } from 'sequelize'

export const getKas = async (req, res) => {
      try {
            const data_kas = await Kas.findAll({
                  order: [
                        ['created_at', 'desc']
                  ],
                  limit: 10
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
            })

            const data_pemasukkan = await Kas.findAll({
                  attributes: [
                        [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN pemasukkan != 0 THEN pemasukkan ELSE 0 END')), 'jml_pemasukkan']
                  ],
                  where: {
                        pemasukkan: {
                              [Op.ne] : 0
                        }
                  }
            });

            const dataPemasukkan = Object.values(data_pemasukkan[0]);

            const data_pengeluaran = await Kas.findAll({
                  attributes: [
                        [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN pengeluaran != 0 THEN pengeluaran ELSE 0 END')), 'jml_pengeluaran']
                  ],
                  where: {
                        pengeluaran: {
                              [Op.ne] : 0
                        }
                  }
            });

            const dataPengeluaran = Object.values(data_pengeluaran[0]);

            const data_saldo = await Kas.findOne({
                  attributes: ['saldo'],
                  order: [
                        ['id_kas', 'desc']
                  ]
            });

            res.status(200).json({
                  'message' : 'Data semua produk',
                  'success' : true,
                  'data' : data_kas,
                  'data_saldo' : data_saldo,
                  'data_pemasukkan' : dataPemasukkan,
                  'data_pengeluaran' : dataPengeluaran,
                  'data_tgl_grafik' : data_tgl_grafik,
                  'data_grafik_nilai' : data_grafik_nilai,
                  'data_grafik_pemasukkan' : data_grafik_pemasukkan,
                  'data_grafik_pengeluaran' : data_grafik_pengeluaran
            });
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const report_saldo = async (req, res) => {
      try {
            const {tanggal1, tanggal2} = req.body;

            if(tanggal1 && tanggal2){
                  var response = await Kas.findAll({
                        where: {
                              tanggal: {
                                    [Op.gte] : tanggal1,
                                    [Op.lte] : tanggal2
                              }
                        },
                        order: [
                              ['created_at', 'desc']
                        ],
                  });
            } else {
                  var response = await Kas.findAll({
                        order: [
                              ['created_at', 'desc']
                        ],
                  });
            }
            res.status(200).json({
                  'message' : 'Detail produk',
                  'success' : true,
                  'data' : response
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const report_pemasukkan = async (req, res) => {
      try {
            const {tanggal1, tanggal2} = req.body;

            if(tanggal1 && tanggal2){
                  var response = await Kas.findAll({
                        where: {
                              pemasukkan: {
                                    [Op.ne] : 0
                              },
                              tanggal: {
                                    [Op.gte] : tanggal1,
                                    [Op.lte] : tanggal2
                              }
                        },
                        order: [
                              ['created_at', 'desc']
                        ]
                  });
            } else {
                  var response = await Kas.findAll({
                        where: {
                              pemasukkan: {
                                    [Op.ne] : 0
                              }
                        },
                        order: [
                              ['created_at', 'desc']
                        ]
                  });
            }
            res.status(200).json({
                  'message' : 'Detail produk',
                  'success' : true,
                  'data' : response
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const report_pengeluaran = async (req, res) => {
      try {
            const {tanggal1, tanggal2} = req.body;

            if(tanggal1 && tanggal2){
                  var response = await Kas.findAll({
                        where: {
                              pengeluaran: {
                                    [Op.ne] : 0
                              },
                              tanggal: {
                                    [Op.gte] : tanggal1,
                                    [Op.lte] : tanggal2
                              }
                        },
                        order: [
                              ['created_at', 'desc']
                        ]
                  });
            } else {
                  var response = await Kas.findAll({
                        where: {
                              pengeluaran: {
                                    [Op.ne] : 0
                              }
                        },
                        order: [
                              ['created_at', 'desc']
                        ]
                  });
            }
            res.status(200).json({
                  'message' : 'Detail produk',
                  'success' : true,
                  'data' : response
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const input_kas = async (req, res) => {
      try {
            var {deskripsi, pemasukkan, pengeluaran } = req.body;
            const tgl_format = (value) => {
                  const datetgl1 = ("0" + value.getDate()).slice(-2);
                  const monthtgl1 = ("0" + (value.getMonth() + 1)).slice(-2);
                  const yeartgl1 = value.getFullYear();
              
                  return yeartgl1 + "-" + monthtgl1 + "-" + datetgl1;
                };

            const tanggal = tgl_format(new Date());

            const { filename } = req.file;

            if(!pemasukkan){
                  pemasukkan = 0;
            }

            if(!pengeluaran){
                  pengeluaran = 0;
            }

            const save = await Kas.create({
                  gambar: filename,
                  deskripsi: deskripsi,
                  tanggal: tanggal,
                  pemasukkan: pemasukkan,
                  pengeluaran: pengeluaran,
                  created_at: new Date(),
                  updated_at: new Date()
            });

            const data_pemasukkan = await Kas.findAll({
                  attributes: [
                        [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN pemasukkan != 0 THEN pemasukkan ELSE 0 END')), 'jml_pemasukkan']
                  ],
                  where: {
                        pemasukkan: {
                              [Op.ne] : 0
                        }
                  }
            });

            const data_pengeluaran = await Kas.findAll({
                  attributes: [
                        [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN pengeluaran != 0 THEN pengeluaran ELSE 0 END')), 'jml_pengeluaran']
                  ],
                  where: {
                        pengeluaran: {
                              [Op.ne] : 0
                        }
                  }
            });

            const JmlPemasukkan = parseInt(Object.values(data_pemasukkan[0])[0].jml_pemasukkan);
            const JmlPengeluaran = parseInt(Object.values(data_pengeluaran[0])[0].jml_pengeluaran);

            const kas_saldo = JmlPemasukkan - JmlPengeluaran;

            await Kas.update({
                  saldo: kas_saldo
            }, {
                  where: {
                        id_kas: save.id_kas
                  }
            });

            res.status(200).json({
                  'message' : 'Simpan Data Produk',
                  'success' : true,
                  'data' : save
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const update_kas = async (req, res) => {
      try {
            var { deskripsi, pemasukkan, pengeluaran } = req.body;

            if(!pemasukkan){
                  pemasukkan = 0;
            }

            if(!pengeluaran){
                  pengeluaran = 0;
            }

            const data_awal = await Kas.findAll({
                  where: {
                        id_kas: req.params.id
                  }
            });

            const data_gte = await Kas.findAll({
                  where: {
                        id_kas: {
                              [Op.gte] : req.params.id
                        }
                  }
            });

            const pemasukkan_awal = data_awal[0].pemasukkan;
            const pengeluaran_awal = data_awal[0].pengeluaran;

            if(req.file){
                  const { filename } = req.file;
                  const gambarAwal = await Kas.findAll({
                        where: {
                              id_kas: req.params.id
                        }
                  });
                  if(fs.existsSync('./public/produk/' + gambarAwal[0].gambar)){
                        fs.unlinkSync('./public/produk/' + gambarAwal[0].gambar);
                  }
                  await Kas.update({
                        gambar: filename,
                        deskripsi: deskripsi,
                        pemasukkan: pemasukkan,
                        pengeluaran: pengeluaran,
                        updated_at: new Date()
                  }, {
                        where: {
                              id_kas: req.params.id
                        }
                  })
            } else {
                  await Kas.update({
                        deskripsi: deskripsi,
                        pemasukkan: pemasukkan,
                        pengeluaran: pengeluaran,
                        updated_at: new Date()
                  },{
                        where: {
                              id_kas: req.params.id
                        }
                  })
            }

            var tambah_saldo = 0;

            if(pemasukkan != 0){
                if(pemasukkan > pemasukkan_awal){
                    tambah_saldo = pemasukkan - pemasukkan_awal;
                } else if (pemasukkan < pemasukkan_awal){
                    tambah_saldo = -1 * (pemasukkan_awal - pemasukkan);
                }
            }

            if(pengeluaran != 0){
                if(pengeluaran < pengeluaran_awal){
                    tambah_saldo = pengeluaran_awal -  pengeluaran;
                } else if (pengeluaran > pengeluaran_awal){
                    tambah_saldo = -1 * (pengeluaran - pengeluaran_awal);
                }
            }


            data_gte.map(async(item) => {
                  await Kas.update({
                        saldo:  item.saldo + tambah_saldo
                  }, {
                        where: {
                              id_kas: item.id_kas
                        }
                  })
            });

            res.status(200).json({
                  'message' : 'Update data Kas berhasil',
                  'success' : true
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const hapus_kas = async (req, res) => {
      try {

            const data_awal = await Kas.findAll({
                  where: {
                        id_kas: req.params.id
                  }
            });

            const data_gte = await Kas.findAll({
                  where: {
                        id_kas: {
                              [Op.gt] : req.params.id
                        }
                  }
            });

            const pemasukkan_awal = data_awal[0].pemasukkan;
            const pengeluaran_awal = data_awal[0].pengeluaran;

            var tambah_saldo = 0;

            if(pemasukkan_awal != 0){
                  tambah_saldo = -1 * pemasukkan_awal;
            }

            if(pengeluaran_awal != 0){
                  tambah_saldo = pengeluaran_awal;
            }


            data_gte.map(async(item) => {
                  await Kas.update({
                        saldo:  item.saldo + tambah_saldo
                  }, {
                        where: {
                              id_kas: item.id_kas
                        }
                  })
            });

            if(req.file){
                  const gambarAwal = await Kas.findAll({
                        where: {
                              id_kas: req.params.id
                        }
                  });
                  if(fs.existsSync('./public/produk/' + gambarAwal[0].gambar)){
                        fs.unlinkSync('./public/produk/' + gambarAwal[0].gambar);
                  }
                  await Kas.destroy({
                        where: {
                              id_kas: req.params.id
                        }
                  })
            } else {
                  await Kas.destroy({
                        where: {
                              id_kas: req.params.id
                        }
                  })
            }

            res.status(200).json({
                  'message' : 'Hapus data Kas berhasil',
                  'success' : true
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}