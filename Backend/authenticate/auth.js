const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Router=express.Router();
const nodemailer=require("nodemailer");
const bodyParser=require("body-parser");


const mailprefix="Dear User, ";
const mailsuffix=" is your otp for collab finder registration";

const table='accounts';

const secretkey=process.env.SECRET_KEY;

const db=require("../dbdata/data");


Router.use(express.json());

Router.use(bodyParser.json());


Router.post("/register/sendotp",async (req,res) =>{

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.SERVER_EMAIL,
          pass: process.env.SERVER_PASSWORD,
      },
      });
      const mailOptions = {
        from: process.env.SERVER_EMAIL,
        to:  process.env.ADMIN_EMAIL,
        subject: "COLLAB FINDER",
        text: "Hello world ", 
        html:
          "content"
      };

      try{
            if(await req.exist===false){

                const {username,email}=await req.body;
                async function setall(){
                    mailOptions.to=email;
                    mailOptions.text=mailprefix+otp+mailsuffix;
                    mailOptions.html=mailprefix+otp+mailsuffix;
                    try{
                        await transporter.sendMail(mailOptions);
                        return 1;
                    }
                    catch(err){
                        console.log(err);
                        
                        return 0;
                    }
                    //res.json({message:"OTP has been sent to your email"});
                }

                const otp = Math.floor(1000 + Math.random() * 9000);
                const hashedotp=jwt.sign({"otp":otp},secretkey,{expiresIn:120});

                db.query(`select otp from otp_table where username="${username}"`,async (err,res1) =>{
                    if(err) {console.log("error while getting otp"); throw new Error(err)}
                    else{
                        if(res1.length===0){
                            db.query(`insert into otp_table (username,otp) values("${username}","${hashedotp}")`,[username,hashedotp],async(err,res2) =>{
                                if(err) {console.log("error while inserting otp"); throw new Error(err)}
                                else{
                                    const value=await setall();
                                    if(value===1){res.json({message:"OTP has been sent to your email"})}
                                    else if(value===0){res.json({message:"Failed to send otp"});}
                                }
                            });
                        }
                        else if(res1.length===1){
                            db.query(`update otp_table set otp="${hashedotp}" where username="${username}"`,async(err,res3) =>{
                                if(err) {console.log("error while updating otp"); throw new Error(err)}
                                else{
                                    const value=await setall();
                                    if(value===1){res.json({message:"OTP has been sent to your email"})}
                                    else if(value===0){res.json({message:"Failed to send otp"});}
                                }
                            });
                        }
                    }
                })
            }
            else if(await req.exist===true) res.json({message:"username already taken"});
        }
        catch(err){
            console.log(err);   
            res.send("Error while generating otp");
        }
});

Router.post("/register/verifyotp",async(req,res) =>{

    try{
        if(await req.exist===false){
            const results=await req.user;
            let {username,password,name,email,otp}=await req.body;
            console.log(username+"    "+otp);

            db.query(`select otp from otp_table where username="${username}"`,async (err,res1) =>{
                console.log(await res1);
                if(err) {console.log("error while getting otp"); throw new Error(err)}
                else{
                    if(await res1.length===1){
                        try{
                            const verification=jwt.verify(res1[0].otp,secretkey);
                            console.log("here");
                            if(otp===`${verification.otp}`){
                                console.log(password);
                                password=await bcrypt.hash(await password,8);
                                console.log(password);
                                db.query(`insert into ${table} (username,password,name,email) values("${username}","${password}","${name}","${email}")`,(err,results) =>{
                                    if(err){console.log(err); throw new Error("Error while adding user")};
                                    res.json({message:"Account Successfully Registered"});
                                });
                            }
                            else res.json({message:"otp is incorrect"});
                        }
                        catch(err) {console.log(err); res.json({message:"otp is incorrect"});}
                    }
                    else if(res1.length===0) res.json({message:"otp is incorrect"});
                }
            });
        }
        else if(await req.exist===true) res.json({message:"username already taken"});
    }
    catch(err){
        console.log(err);   
        res.send("otp is incorrect");
    }
});


Router.post("/login",async (req,res) =>{

        const{username,password}=await req.body;

        if(await req.exist===true){
            const results=await req.user;
            
            if(await bcrypt.compare(password,results[0].password)){
                const cookie=jwt.sign({"username":username},secretkey,{expiresIn:"100h"});
                res.json({message:"Successfully Loggedin","cookie":cookie});
            }
            else
                res.json({message:"Invalid Credentials"});  
        }
        else if(await req.exist===false) res.json({message:"Invalid Credentials"});
});

Router.post("/forgotpassword/sendotp",async(req,res) =>{
    const{username}=await req.body;

        if(await req.exist===true && username){

            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                  user: 'pradeepdedsec@gmail.com',
                  pass: 'cpkl oatl iqal mtqu',
              },
              });
              const mailOptions = {
                from: 'pradeepdedsec@gmail.com',
                to:  process.env.ADMIN_EMAIL,
                subject: "COLLAB FINDER",
                text: "Hello world ", 
                html:
                  "content"
              };


              try{
    
                    let email=await req.user[0].email;
                    console.log(await req.user);
                    console.log(email);
                    function setall(){
                        mailOptions.to=email;
                        mailOptions.text=mailprefix+otp+" is your otp";
                        mailOptions.html=mailprefix+otp+" is your otp";
                        transporter.sendMail(mailOptions);
                        res.json({message:"OTP has been sent to your email"});
                    }
    
                    const otp = Math.floor(1000 + Math.random() * 9000);
                    const hashedotp=jwt.sign({"otp":otp},secretkey,{expiresIn:120});
    
                    db.query(`select otp from otp_table where username="${username}"`,async (err,res1) =>{
                        if(err) {console.log("error while getting otp"); throw new Error(err)}
                        else{
                            if(res1.length===0){
                                db.query(`insert into otp_table (username,otp) values("${username}","${hashedotp}")`,[username,hashedotp],async(err,res2) =>{
                                    if(err) {console.log("error while inserting otp"); throw new Error(err)}
                                    else
                                        setall();
                                });
                            }
                            else if(res1.length===1){
                                db.query(`update otp_table set otp="${hashedotp}" where username="${username}"`,async(err,res3) =>{
                                    if(err) {console.log("error while updating otp"); throw new Error(err)}
                                    else
                                        setall();
                                });
                            }
                        }
                    });
            }
            catch(err){
                console.log(err);   
                res.send("Error while generating otp");
            }
        }
        else if(await req.exist===false) res.json({message:"Invalid username"});
});


Router.post("/forgotpassword/verifyotp",async(req,res) =>{

        let{username,password,otp}=await req.body;
        console.log(await otp);

        db.query(`select otp from otp_table where username="${username}"`,async (err,res1) =>{
            console.log(await res1);
            if(err) {console.log("error while getting otp"); throw new Error(err)}
            else{
                if(await res1.length===1){
                    try{
                        const verification=jwt.verify(res1[0].otp,secretkey);
                        if(otp===`${verification.otp}`){
                            password=await bcrypt.hash(password,8);
                            db.query(`update ${table} set password="${password}" where username="${username}"`,(err,results) =>{
                                if(err){console.log(err); throw new Error("Error while updating password")};
                                res.json({message:"Password Successfully Updated"});
                            });
                        }
                        else res.json({message:"otp is incorrect"});
                    }
                    catch(err) {console.log(err); res.json({message:"otp is incorrect"});}
                }
                else if(res1.length===0) res.json({message:"otp is incorrect"});
            }
        });

});


module.exports=Router


