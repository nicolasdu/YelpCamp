var express=require("express"),
    router=express.Router(),
    Campground=require("../models/campground"),
    middleware=require("../middleware/index.js");

//INDEX - show all campgrounds
router.get("/campgrounds",function(req,res){
    //get all campgrounds from the DB 
    Campground.find({},function(err,allCampgrounds){
        if(err){
            req.flash("error","Something Went Wrong!");
        } 
        else{
            res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});
        }
    });
});

//NEW - show form to create new campground
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
   res.render("campgrounds/new");
});

//CREATE - add new campgrounds to DB using a form
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var img=req.body.image;
    var desc=req.body.desc;
    var price=req.body.price;
    var user={
        id:req.user._id,
        username:req.user.username
    };
    var newCampground={name:name,image:img,description:desc,user:user,price:price};
    Campground.create(newCampground,function(err,campground){
        if(err){
           req.flash("error","Something Went Wrong!");
        }
        else{
            res.redirect("campgrounds");
        }
    });
});

//SHOW - shows more info about campgrounds
router.get("/campgrounds/:id",function(req, res) {
    //find the campgrpund with the provided id
    var info = req.params.id;
    Campground.findById(info).populate("comments").exec(function(err,campground){
        if(err){
           req.flash("error","Campground is not found!");
           res.redirect("back");
        }
        else{
            //render show template with that campground
             res.render("campgrounds/show",{campground:campground});
        }
    });
});

//EDIT Campgroud ROUTE 
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                 req.flash("error","Something Went Wrong!"); 
            }
            else {
                    res.render("campgrounds/edit",{campground:foundCampground});
            }
    });
});

//UPDATE Campgroud ROUTE 
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    var data={name:req.body.name,image:req.body.image,description:req.body.desc};
    Campground.findByIdAndUpdate(req.params.id,data,function(err,updateCampground){
        if(err){
            res.redirect("/campground");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY Campground ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err,updateCampground){
        if(err){
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            req.flash("success","Campgroud Deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports=router;