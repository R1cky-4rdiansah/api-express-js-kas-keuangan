import express from "express";
import cors from "cors";
import produkRoute from './routes/productsRoute.js';
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api', produkRoute);
app.use(express.static('public'))


app.listen(5000, () => console.log('Server berjalan'));