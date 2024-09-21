const {createHmac,randomBytes}=require('crypto');
const {createTokenForUser}=require('../services/authentication');
const {Schema,model}=require('mongoose');


const userSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    profileImageURL:{
        type:String,
        default:"/images/default.png"
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    },
},
    {timestamps:true}
    );

userSchema.pre("save",async function(next){
    const user=this;
    if(!user.isModified("password")){
        return
    }
    const salt=randomBytes(16).toString("hex");
    const hash=createHmac('sha256',salt).update(user.password).digest('hex');
    this.salt=salt;
    this.password=hash;
    next();
});



userSchema.static("matchPasswordAndGenerateToekn", async function(email,password){
    const user=await this.findOne({email});
    if(!user){
        throw new Error("User not found");
    }
    //console.log("user in model:",user);
    const salt=await user.salt;
    const hashesPassword=await user.password;
    const userprovidedPassword=createHmac('sha256',salt).update(password).digest('hex');
    if (hashesPassword!==userprovidedPassword){
        throw new Error("Password is incorrect");
    }
    const token=await createTokenForUser(user);

    return token;
});

const User=model('User',userSchema);
module.exports=User;