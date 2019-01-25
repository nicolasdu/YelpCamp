var express=require("express"),
    router=express.Router(),
    passport=require("passport"),
    User=require("../models/user");


//root landing page route
router.get("/",function(req,res){
   res.render("landing");
});

//Show register form
router.get("/register",function(req, res) {
   res.render("authentication/register"); 
});

//handle sign up logic
router.post("/register",function(req, res) {
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            return res.render("authentication/register",{error:err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");            
        });
    });
});

//Show login form
router.get("/login",function(req, res) {
   res.render("authentication/login"); 
});

//handle login logic
//router.post("/login",middleware,callback)
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"autentication/login"
    }
    ),function(req, res){}
);

//logout Route
router.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","Logged you out!");
   res.redirect("/campgrounds");
});

module.exports=router;