const mysql=require("mysql");


const db=mysql.createConnection({
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    host:process.env.DB_HOST,
    database:process.env.DATABASE
});

db.connect();

module.exports=db
