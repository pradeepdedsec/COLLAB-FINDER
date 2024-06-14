const express=require("express");
const multer = require('multer');
const fs = require('fs');
const mysql=require('mysql');
const path = require('path');
const Router=express.Router();

const table='accounts';

const db=require("../dbdata/data");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

Router.post('/upload/:username', upload.single('image'),async (req, res) => {
    const username=req.params.username;
    try {
        if (!req.file) {
        return  res.status(400).json({"message":'Error uploading image.'});
        }

        const imagePath = path.join(__dirname, 'uploads', req.file.filename);

        db.query(`update accounts set profile_name="${req.file.filename}" where username="${username}"`,async (err,res1)=>{
          if (err){
            console.log(err);
            res.status(500).json({"message":'Error uploading image.'});
          }
          else{
            res.status(201).json({"message":'Image uploaded successfully.'});
          }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({"message":'Error uploading image.'});
    }
});




module.exports=Router

