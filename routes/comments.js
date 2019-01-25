var express=require("express"),
    router=express.Router(),
    Campground=require("../models/campground"),
    Comment=require("../models/comment"),
    middleware=require("../middleware/index.js");


//NEW ROUTE - render the comment form
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req, res) {
    Campground.findById((req.params.id),function(err,campground){
        if(err){
            console.log(err);
        }
        else{
              res.render("comments/new",{campground:campground});
        }
    });
});

//CREATE ROUTE - add new comment to the campground in DB
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
    var text=req.body.text;
    var author=req.body.author;
    Campground.findById(req.params.id,function(err,campground){
        if(err){
                  res.redirect("/campgrounds");
        }
        else{
                Comment.create({text:text,author:author},function(err, comment){
                    if(err){
                            req.flash("error","Something Went Wrong!");    
                    }
                    else{
                        comment.author.username=req.user.username;
                        comment.author.id=req.user._id;
                        comment.date=Date.now();
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        
                        req.flash("success","Successfully added comment");
                        res.redirect("/campgrounds/"+req.params.id);
                    }
                  });
    
             }
    });
});

//EDIT Comment ROUTE 
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
        Campground.findById(req.params.id,function(err, foundCampground) {
            if(err){
                res.redirect("back");
            }
            else{
                Comment.findById(req.params.comment_id,function(err,foundComment){
                    if(err){
                         req.flash("error","Comment is not found!"); 
                    }
                    else{
                      res.render("comments/edit",{comment:foundComment,campground:foundCampground});
                    }
              });
            }
        });
});

//UPDATE Comment ROUTE 
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
     var data={text:req.body.text};
     Comment.findByIdAndUpdate(req.params.comment_id,data,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY Comment ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err,updateCampground){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment Deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    }); 
});

module.exports=router;