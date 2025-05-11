const { request } = require("express");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const User = require('./models/User');
const Post = require('./models/Post');
const { info } = require("console");
const uploadMiddleware = multer({dest:'uploads/'});

const app = express();
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());

const salt = bcrypt.genSaltSync(10);//random string generation
const secret = 'kd7ychrwhidqmr84r9';//random string generation

try{
    mongoose.connect("mongodb+srv://cdac:2yNrWqmihgsrc0F5@blogcluster.jezgeaw.mongodb.net/?retryWrites=true&w=majority&appName=blogCluster");
    console.log("BloggerDB Connected...!");
}
catch(error){
    console.log("error in connecting bloggerDB")
}


app.get('/',(request,response)=>{
    try{
        response.json("Welcome to Blogger...");
    }
    catch(error){
        response.status(500).json("Error in fetching",error);
    }
});

app.get('/profile',(request,response)=>{
    try{
        const {token} = request.cookies;
        jwt.verify(token,secret,{},(error,info)=>{
        if(error){
             throw error;
        }
        response.json(info);
        });
    }
    catch(error){
        response.json("Fetching error");
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

app.post('/logout', (request,response) => {
  response.cookie('token', '').json("Logout sucsessfully");
});

app.post('/register', async (request, response) => {
    const { username, password } = request.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        response.json(userDoc);
    }
    catch (error) {
        response.status(400).json("Registraton failed", error);
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
            response.cookie('token', token).json('Login sucssesful');
        });
    }
    else {
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

app.post('/post', uploadMiddleware.single('file'), async (request, response) => {
    try {
        const { originalname } = request.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);

    const {title,summary,content} = request.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id
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

app.get('/post/:id',async (request,response)=>{
    const {id} = request.params; 
    const postDoc = await Post.findById(id).populate('author',['username']);
    response.json(postDoc);
});

app.put('/post',uploadMiddleware.single('file'), async (request,response)=>{
    let newPath = null;
    if(request.file){
        const { originalname } = request.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const {token} = request.cookies;
    jwt.verify(token, secret, {}, async (error, info) => {
            if (error)
                throw error;

            const {id, title, summary, content } = request.body;
            const postDoc = await Post.findById();
            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
            response.json({isAuthor,postDoc,info});
            if(!isAuthor){
                return response.status(400).json("You are not the author");
            }
            await postDoc.update(
                {title,
                    summary,
                    content,
                    cover:newPath ? newPath : postDoc.cover,
                });
            response.json(postDoc);
        });
});

app.listen(8000, () => {
    try {
        console.log('server is running on URL http://localhost:7077');
    }
    catch (error) {
        console.log("Error in Connection...!");
    }
});