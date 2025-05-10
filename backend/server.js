const { request } = require("express");
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const User = require('./models/User');
const Post = require('./models/Post');
const uploadMiddleware = multer({dest:'uploads/'});

const app = express();
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());

const salt = bcrypt.genSaltSync(10);//random string generation
const secret = 'kd7ychrwhidqmr84r9';//random string generation

mongoose.connect("mongodb+srv://cdac:2yNrWqmihgsrc0F5@blogcluster.jezgeaw.mongodb.net/?retryWrites=true&w=majority&appName=blogCluster");

app.post('/register', async (request, response) => {
    const { username, password } = request.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password,salt),
        });
        response.json(userDoc);
    }
    catch(error){
        response.status(400).json("Registraton failed",error);
    }    
});

app.post('/login', async (request,response)=>{
    const {username,password} = request.body;
    const userDoc = await User.find({username});
    const passOk = bcrypt.compareSync(password,userDoc.password);
    if(passOk){
        jwt.sign({username,id:userDoc.id},secret,{},(error,token)=>{
            if(error)
                throw error;
            response.cookie('token',token).json('Login sucssesful');
        });
    }
    else{
        response.status(400).json('Wrong credentials');
    }
});

app.get('/profile',(request,response)=>{
    const {token} = request.cookies;
    jwt.verify(token,secret,{},(error,info)=>{
        if(error)
            throw error;
        response.json(info);
    });
});

app.post('/post',uploadMiddleware.single('file'),async (request,response)=>{
    try{
    const{originalname} = request.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1]; 
    const newPath = path +'.'+ ext;
    fs.renameSync(path,newPath);

    const {title,summary,content} = request.body;
    await postDoc = Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:
    });

    response.json(postDoc);
    }
    catch(error){
        response.status(500).json("Error in uploading...!",error);
    }
});

app.get('/post',async (request,response)=>{
    try{
        response.json(await Post.find());
    }
    catch(error){
        response.status(500).send("Not available...!")
    }
});

app.listen(7077, () => {
    try {
        console.log('server is running on PORT:7077');
    }
    catch (error) {
        console.log("Error in Connection...!");
    }
});

//2yNrWqmihgsrc0F5
//mongodb+srv://cdac:2yNrWqmihgsrc0F5@blogcluster.jezgeaw.mongodb.net/?retryWrites=true&w=majority&appName=blogCluster