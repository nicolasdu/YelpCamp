var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var UserSchema=new mongoose.Schema(
    {
        username:String,
        password:String
    }
);

UserSchema.plugin(passportLocalMongoose);// will add authentication methods to the user 

//compile the Schema into a Model
module.exports=mongoose.model("User",UserSchema);