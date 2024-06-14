const express=require("express");
const jwt=require("jsonwebtoken");
const Router=express.Router();
const db=require("../dbdata/data")
const secretkey=process.env.SECRET_KEY;

const table='accounts';

Router.use(express.json());

const tokenlayer=async (req,res,next)=>{
    let name;
    try{
        name=jwt.verify(req.cookies.collab,secretkey);
        if(!name)
        res.json({message:"Unauthorized"});
        else{
            db.query(`select * from accounts where username="${name.username}"`,async(err,results) =>{
                if(err){ 
                    throw new Error("Error in db");
                }

                if(results.length===0){
                    res.json({message:"Unauthorized"});
                }
                else if(results.length===1){
                    req.user=await results[0];
                    next();
                }    
            });
        }
    }
    catch(err){
        console.log(err);
        res.json({message:"Unauthorized"});
    }
}

module.exports=tokenlayer