const {Schema,model}=require('mongoose');

const blogSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},
{timestamps:true}
);

const Blog =model('blog',blogSchema);

module.exports=Blog;