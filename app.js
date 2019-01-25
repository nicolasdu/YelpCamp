var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    methodOverride=require("method-override"),
    flash=require("connect-flash"),
    User=require("./models/user");
    //seedDB=require("./seeds");

//requring ROUTES    
var campgroundRoutes=require("./routes/campgrounds"),
    commentRoutes=require("./routes/comments"),
    authRoutes=require("./routes/index");
    
//mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });
mongoose.connect("mongodb://nicola:a123456@ds213255.mlab.com:13255/yelpcamp1",{ useNewUrlParser: true });


app.use(flash());
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
//seedDB(); //seeds the DB

// PASSPORT CONGIFURATIONS
app.use(require("express-session")({
    secret:"This secret is used to decode the info",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing the user state for any user to each ejs template
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
   
   console.log("YelpCamp is running!!"); 
    
});