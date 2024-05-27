import express from "express";
import cors from "cors";
import kasRoutes from './routes/kasRoute.js';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import db2 from "./config/database2.js";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api', kasRoutes);
app.use(express.static('public'));

// db2.on('error', function(err){
//       console.log('Mongoose db error: ' + err);
// });

// db2.on('connected', function(){
//       console.log('Mongoose connected');
// });


app.listen(5000, () => console.log('Server berjalan'));