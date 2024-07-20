const express=require("express");
const dotenv=require('dotenv').config();
const jwt=require("jsonwebtoken");
const os=require("os");

const cors=require('cors');
const app=express();
const {dbaccount}=require("./repo/repo");
const {getDetails,isExist} =require("./middleware/midlayer");
const bodyParser=require("body-parser");
const cookieParser=require('cookie-parser')
const path=require('path');
const {Server}=require("socket.io");
const http=require("http");
const gettokendetails = require("./middleware/tokenverify");
const db = require("./dbdata/data");

const server=http.createServer(app);

const io=new Server(server,{
        cors:{
            origin:['http://127.0.0.1:3000','http://localhost:3000'],
            methods:['GET','POST']
        }
    }
);

const corsOptions={
    origin:['http://127.0.0.1:3000','http://localhost:3000'],
    methods:['GET','POST','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization'],credentials:true,
}

let users=new Map();

function getKeyByValue(value){
    for(let[key,val] of users.entries()){
        if(val === value){
            return key;
        }
    }
    return undefined;
}

io.on("connection",async (socket)=>{
    console.log("User Connected :"+socket.id);

    let userid=socket.handshake.query.userId;
    if(userid){
        let name=jwt.verify(userid,process.env.SECRET_KEY);
        if(name){
            users.set(name.username,socket.id)
            console.log("user :",name.username);
        }
    }
    else{
        console.log("users :");
    }

    socket.on("savechat",async (data)=>{
        let {to,message}=data;
        let sender=getKeyByValue(socket.id);

        function exe(result0){
            console.log("scene :",result0);
            io.to(users.get(to)).emit("receive_message",result0);
            io.to(users.get(sender)).emit("receive_message",result0);
        }
        console.log("sender :",sender);
        if(sender){
            await savechat(sender,message,to,exe);
        }
    });

    socket.on("hello",(data)=>{
        console.log("hello");
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected :"+socket.id);
    });
});

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



server.listen(5001,() =>{
    console.log("socket server started at 5000");
})

app.listen(5000,'0.0.0.0',() =>{
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];
  
    for (const interfaceName in networkInterfaces) {
      for (const net of networkInterfaces[interfaceName]) {
        if (net.family === 'IPv4' && !net.internal) {
          addresses.push(net.address);
        }
      }
    }
  
    console.log("Server is running on:");
    addresses.forEach(address => console.log(`http://${address}:5000`));
});


const savechat =async function(username,message,to,exe){
    db.query(`insert into message (sender,receiver,chat) values("${username}","${to}","${message}")`,async(err,res1)=>{
        if(err) {console.log(err); return({"message":"Invalid user 1"})}
        else{
            db.query(`select sender,receiver,chat,timestamp from message where id="${await res1.insertId}"`,async(err,res2)=>{
                if(err) {console.log(err); return({"message":"Invalid user 1"})}
                else{
                    console.log("message 0:"+JSON.stringify(res2));
                    exe(res2[0]);
                } 
            });
        } 
    });
}
