import express from 'express';
import { getProducts, getProducId, saveProduct, updateProduct, deleteProduct } from '../controller/productController.js';
import { Login, Register, verifyToken, Logout, ganti_password, Update, Delete, getUsers, getUser } from '../controller/userController.js'
import { getKas, report_pemasukkan, report_pengeluaran, input_kas, update_kas, hapus_kas, report_saldo, showGambar, hapus_gambar } from '../controller/kasController.js'
import multer from 'multer';



const storageMulter = multer.diskStorage({
      destination: function(req, file, cb){
            cb(null, './public/bukti_kas')
      },
      filename: function(req, file, cb){
            let split = file.mimetype.split('/');
            let ext = split[split.length - 1];
            let splitGmb = file.originalname.split('.');
            let originalname = splitGmb[0];
            cb (null, originalname + "_" + Date.now() + '.' + ext);
      }
});


const uploads = multer({storage: storageMulter})

const router = express.Router();

router.get('/produk', verifyToken, getProducts);
router.post('/detail/:id', getProducId);
router.post('/update/:id', verifyToken, uploads.single('gambar'), updateProduct);
router.post('/hapus/:id', verifyToken, deleteProduct);
router.post('/simpan', verifyToken, uploads.single('gambar'), saveProduct);

router.get('/users', verifyToken, getUsers);
router.get('/getUser/:id', verifyToken, getUser);
router.post('/register', uploads.none(), Register);
router.post('/update_users/:id', verifyToken, uploads.none(), Update);
router.post('/delete_users/:id', verifyToken, uploads.none(), Delete);
router.post('/ganti_password', verifyToken, uploads.none(), ganti_password);
router.post('/login', uploads.none(), Login);
router.post('/logout', verifyToken, uploads.none(), Logout);

router.get('/kas', verifyToken, getKas);
router.post('/report_pemasukkan', verifyToken, uploads.none(), report_pemasukkan);
router.post('/report_pengeluaran', verifyToken, uploads.none(), report_pengeluaran);
router.post('/report_saldo', verifyToken, uploads.none(), report_saldo);
router.post("/input_kas", verifyToken, uploads.array("gambar"), input_kas);
router.get("/gambar/:id", verifyToken, showGambar);
router.post('/update_kas/:id', verifyToken, uploads.array("gambar"), update_kas);
router.post('/hapus_kas/:id', verifyToken, hapus_kas);
router.post('/hapus_gambar/:id', verifyToken, hapus_gambar);

export default router;