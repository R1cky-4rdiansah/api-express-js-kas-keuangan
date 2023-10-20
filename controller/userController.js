
import Users from "../models/userModel.js";
import bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";

export const Register = async (req, res) => {
      try {
            const { name, email, password, level, username } = await req.body;
            const salt = await bcrypt.genSalt();
            const newPassword = await bcrypt.hash(password, salt);
            const response = await Users.create({
                  name: name,
                  email: email,
                  password: newPassword,
                  level: level,
                  username: username,
                  created_at: new Date(),
                  updated_at: new Date()
            });
            res.status(200).json({
                  'message' : 'Data berhasil disimpan',
                  'Success' : true,
                  'data' : response
            });
      } catch (error) {
            res.status(400).json(error.message);
      }
}

export const Login = async (req, res) => {
      try {
            const { username, password } = await req.body;
            const getUserLog = await Users.findAll({
                  where: {
                        username
                  }
            });
            if(!getUserLog[0]) return res.status(400).json({
                  'message': 'Username Tidak ditemukan',
                  'success': false
            })
            const idUserLog = getUserLog[0].id;
            const emailUserLog = getUserLog[0].email;
            const nameUserlog = getUserLog[0].name;
            const usernameUserlog = getUserLog[0].username;
            const match = await bcrypt.compare(password, getUserLog[0].password);
            
            if(!match){
                  return res.status(400).json({
                        'message' : 'Mohon maaf password tidak cocok',
                        'success': false
                  });
            }
            
            const token = jwt.sign({ idUserLog, emailUserLog, nameUserlog, usernameUserlog }, process.env.ACCESS_TOKEN_SECRET, {
                  expiresIn: '1d'
            });
            
            res.status(200).json({
                  'message': 'Login berhasil',
                  'success': true,
                  'data': getUserLog[0],
                  'token': token
            });

      } catch (err) {
            return res.status(404).json(err.message);
      }
}

export const verifyToken = (req, res, next) => {
      const headers = req.headers['authorization'];
      if(!headers) return res.status(401).json({'message': 'Maaf anda tidak dapat mengakses website ini'});
      const getToken = headers.split(' ')[1];
      if(getToken == null) return res.status(401).json({
            'message': 'Anda tidak dapat mengakses link ini, harap login ulang'
      });
      jwt.verify(getToken, process.env.ACCESS_TOKEN_SECRET, (err) => {
            if(err) return res.sendStatus(403);
            next();
        })
}

export const Logout = (req, res) => {
      const headers = req.headers['authorization'];
      jwt.sign(headers, "", {
            expiresIn: 1
      }, (logout, err) => {
            if(logout)
            return res.status(200).json({'message': 'Anda telah logout'})
            if(err)
            return res.status(400).json(err.message);
      });

}

export const ganti_password = async (req, res) => {

      try {
            const { id_user, password, new_password } = req.body;

            const getUserLog = await Users.findAll({
                  where: {
                        id: id_user
                  }
            });
      
            const idUserLog = getUserLog[0].id;
            const emailUserLog = getUserLog[0].email;
            const nameUserlog = getUserLog[0].name;
            const usernameUserlog = getUserLog[0].username;
      
            const password_lama = getUserLog[0].password;
            const match = await bcrypt.compare(password, password_lama);
            if(!match) return res.status(400).json({'message' : 'Password Salah'});
      
            const salt = await bcrypt.genSalt();
            const newPass = await bcrypt.hash(new_password, salt);
      
            const update_pass = await Users.update({
                  password: newPass
            }, {
                  where: {
                        id: id_user
                  }
            });
      
            const token = jwt.sign({ idUserLog, emailUserLog, nameUserlog, usernameUserlog }, process.env.ACCESS_TOKEN_SECRET, {
                  expiresIn: '1d'
            });
            
            res.status(200).json({
                  'message': 'Ganti Passwod Berhasil',
                  'success': true,
                  'data' : update_pass,
                  'token': token
            });
      } catch (error) {
            return res.status(500).json(error.message)
      }
}

export const Update = async (req, res) => {
      try {
            const { nama, email, level, username } = await req.body;
            const response = await Users.update({
                  name: nama,
                  email: email,
                  level: level,
                  username: username,
                  updated_at: new Date()
            }, {
                  where: {
                        id: req.params.id
                  }
            });
            res.status(200).json({
                  'message' : 'Data berhasil diupdate',
                  'Success' : true,
                  'data' : response
            });
      } catch (error) {
            res.status(400).json(error.message);
      }
}

export const Delete = async (req, res) => {
      try {
            await Users.destroy({
                  where: {
                        id: req.params.id
                  }
            });
            res.status(200).json({
                  'message' : 'Data berhasil dihapus',
                  'Success' : true
            });
      } catch (error) {
            res.status(400).json(error.message);
      }
}

export const getUsers = async(req, res) => {
      try {
            const response = await Users.findAll();
            res.status(200).json({
                  'message' : 'Data Users',
                  'Success' : true,
                  'data' : response
            })
      } catch (error) {
            res.status(500).json(error.message)
      }
}

export const getUser = async(req, res) => {
      try {
            const response = await Users.findOne({
                  where: {
                        id: req.params.id
                  }
            });
            res.status(200).json({
                  'message' : 'Data Users',
                  'Success' : true,
                  'data' : response
            })
      } catch (error) {
            res.status(500).json(error.message)
      }
}
