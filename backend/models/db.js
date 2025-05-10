import { createConnection } from "mysql2";

/*
 * here we are creating connection with mysql server.
 * with appropiate credentials.
 * 
 * ALTER USER 'root'@'localhost' IDENTIFIED BY 'cdac';
 * flush privileges;
 * 
 * run these two commands when you run mysql server first time. 
 */
const PORT = 7800;
const conn = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cdac',
    database: 'blog_webapp_db'
});

//establishing connection here
conn.connect((error)=>{
    if(error){
        console.log("Error in connecting database...",error);
    }
    else{
        console.log("Database Connected Sucsessfully !!!");
    }
});

