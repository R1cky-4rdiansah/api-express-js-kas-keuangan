import Products from "../models/produkModel.js";
import fs from 'fs'

export const getProducts = async (req, res, next) => {
      try {
            const filter = (datas, page) => {
                  const { count: totalItem,  rows: data } = datas;
                  const last_page = Math.ceil(totalItem/5);
                  return { data, last_page, current_page: page  }
            }
            await Products.findAndCountAll({
                  order: [
                        ['created_at', 'desc']
                  ]
            }).then((data) => {
                  const page = parseInt(req.query.page);
                  const response = filter(data, page);
                  res.status(200).json({
                        'message' : 'Data semua produk',
                        'success' : true,
                        'data' : response
                  });
            });

            console.log(req.query.page);
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const getProducId = async (req, res, next) => {
      try {
            const response = await Products.findOne({
                  where: {
                        id: req.params.id
                  }
            });
            res.status(200).json({
                  'message' : 'Detail produk',
                  'success' : true,
                  'data' : response
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const saveProduct = async (req, res, next) => {
      try {
            const response = await Products.create({
                  judul: req.body.judul,
                  gambar: req.file.filename,
                  harga: req.body.harga,
                  deskripsi: req.body.deskripsi,
                  created_at: new Date(),
                  updated_at: new Date()
            });
            res.status(200).json({
                  'message' : 'Simpan Data Produk',
                  'success' : true,
                  'data' : response
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const updateProduct = async (req, res, next) => {
      try {
            if(req.file){
                  const gambarAwal = await Products.findAll({
                        where: {
                              id: req.params.id
                        }
                  });
                  if(fs.existsSync('./public/produk/' + gambarAwal[0].gambar)){
                        fs.unlinkSync('./public/produk/' + gambarAwal[0].gambar);
                  }
                  await Products.update({
                        judul: req.body.judul,
                        harga: req.body.harga,
                        deskripsi: req.body.deskripsi,
                        gambar: req.file.filename,
                        updated_at: new Date()
                  }, {
                        where: {
                              id: req.params.id
                        }
                  })
            } else {
                  await Products.update({
                        judul: req.body.judul,
                        harga: req.body.harga,
                        deskripsi: req.body.deskripsi,
                        updated_at: new Date()
                  },{
                        where: {
                              id: req.params.id
                        }
                  })
            }
            const dataAkhir = await Products.findAll({
                  where: {
                        id: req.params.id
                  }
            });
            res.status(200).json({
                  'message' : 'Update data produk',
                  'success' : true,
                  'data' : dataAkhir
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}

export const deleteProduct = async (req, res, next) => {
      try {
            const gambarAwal = await Products.findAll({
                  where: {
                        id: req.params.id
                  }
            });
            if(fs.existsSync('./public/produk/' + gambarAwal[0].gambar)){
                  fs.unlinkSync('./public/produk/' + gambarAwal[0].gambar);
            }
            await Products.destroy({
                  where: {
                        id: req.params.id
                  }
            });
            res.status(200).json({
                  'message' : 'Data telah terhapus',
                  'success' : true,
            })
      } catch (error) {
            res.status(400).json(error.message)
      }
}