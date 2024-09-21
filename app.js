const express = require('express');
const path=require('path');
require ('dotenv').config();

const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const Blog=require('./models/blog');

const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const checkForAuthenticationCookie = require('./middleware/authentication');
const app=express();



const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log('Error:',err);
});

app.set('view engine', 'ejs')
app.set('views',path.resolve("./views"));

app.get('/',async(req,res)=>{
    const allBlogs=await Blog.find().populate('createdBy');
    res.render('home',{
        user:req.user,
        blogs:allBlogs
    });
})

app.use('/user',userRoute);
app.use('/blog',blogRoute);