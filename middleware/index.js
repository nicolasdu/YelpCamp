var middlewareObj={};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

//adding a middleware to check Campground Ownership
middlewareObj.checkCampgroundOwnership=function(req,res,next){
     if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error","Campground Not Found");
            res.redirect("back");
        }
        else{
            //does the user owns the campground ?
            if(foundCampground.user.id.equals(req.user._id)){
                 next();
            }else{
                req.flash("error","You don't have permissions to do that");
                res.redirect("back");
            }
        }
    });}
    
    else{
            req.flash("error","You need to be logged in");
            res.redirect("back");
        }
}
//adding a middleware to check if user is logged in 
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in");
    res.render("./authentication/login");
}

//adding a middleware to check Comment Ownership
middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash("error","Comment Not Found");
            res.redirect("back");
        }
        else{
            //does the user owns the comment ?
            if(foundComment.author.id.equals(req.user._id)){
                 next();
            }else{
                req.flash("error","You don't have permissions to do that");
                res.redirect("back");
            }
        }
    });}
    
    else{
            req.flash("error","You need to be logged in");
            res.redirect("back");
        }
}
module.exports=middlewareObj;