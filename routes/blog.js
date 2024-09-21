const {Router} = require('express');
const  Blog  = require('../models/blog');
const Comment = require('../models/comment');

const router=Router();
const multer=require('multer');
const path=require('path');

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    });
});

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.resolve('./public/uploads'));
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname));
    }
});
const upload=multer({storage:storage});

router.post('/',upload.single("coverImage"),async (req,res)=>{
    const {title,content}=req.body;
    const blog=await Blog.create({title,
        content,
        createdBy:req.user._id,
        coverImage:`/uploads/${req.file.filename}`,
});
    // console.log("Blog created");
    // console.log("Title:",title,"Content:",content);
    //return res.redirect('/');
    //return res.redirect(`/blog/${req.user._id}`);
    return res.redirect(`/blog/${blog._id}`);
});

router.get('/:id',async (req,res)=>{
    const blog=await Blog.findById(req.params.id).populate('createdBy');
    const comments=await Comment.find({blogId:req.params.id}).populate('createdBy');
    return res.render('blog',{
        user:req.user,
        blog,
        comments
    });
})

//comment routes
router.post('/comment/:blogId',async (req,res)=>{
    const comment=await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    });
    console.log("Comment created");
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports=router;