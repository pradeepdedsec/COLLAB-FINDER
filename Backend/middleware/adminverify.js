const express=require("express");
const jwt=require("jsonwebtoken");
const Router=express.Router();
const secretkey=process.env.SECRET_KEY;
const adminusername=process.env.ADMIN_USERNAME;


Router.use(express.json());

const adminverify=async (req,res,next)=>{
    let name;
    try{
        name=jwt.verify(req.cookies.collab,secretkey);

        if(!name)
            res.json({message:"Unauthorized"});
        else{
            if(name.username===adminusername){
                next();
            }
            else{
                res.json({message:"Unauthorized"});
            }
        }
    }
    catch(err){
        console.log(err);
        res.json({message:"Unauthorized"});
    }
}

module.exports=adminverify