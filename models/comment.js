var mongoose=require("mongoose");

var commentSchema=new mongoose.Schema({
   text:String,
   author:{
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      username:String
   },
   date:{
      type:Date,
   }
   });

//compile the Schema into a Model
module.exports= mongoose.model("Comment",commentSchema);