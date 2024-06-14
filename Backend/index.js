const express=require("express");
const dotenv=require('dotenv').config();

const cors=require('cors');
const app=express();
const {dbaccount}=require("./repo/repo");
const {getDetails,isExist} =require("./middleware/midlayer");
const bodyParser=require("body-parser");
const cookieParser=require('cookie-parser')
const path=require('path');

const corsOptions={
    origin:'http://localhost:3000',
    methods:['GET','POST','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization'],credentials:true,
}

app.use(express.json());
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());


app.use("/auth",getDetails,isExist,require("./authenticate/auth"));
app.use("/home",require("./middleware/tokenverify"),require("./user/user"));
app.use("/profile",require("./middleware/tokenverify"),require("./user/profile"));
app.use("/feedback",require("./middleware/tokenverify"),require("./user/feedback"));
app.use("/message",require("./middleware/tokenverify"),require("./user/message"));
app.use("/test",require("./user/test"));
app.use("/admin/auth",require("./authenticate/adminauth"));
app.use("/teamrequest",require("./middleware/tokenverify"),require("./user/Request"));
app.use("/admin",require("./middleware/adminverify"),require("./admin/admin"));
app.use("/profilepic",require("./middleware/tokenverify"),require("./user/profilepicture"));
app.use("/posts",require("./middleware/tokenverify"),require("./user/posts"));

app.listen(5000,() =>{
    console.log("server started at 5000");
});
