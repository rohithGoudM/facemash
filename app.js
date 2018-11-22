var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"), 
	authRoutes  = require('./routes/auth-routes'),
	profileRoutes  = require('./routes/profile-routes'),
	passportSetup = require('./config/passport-setup'),
	cookieSession= require('cookie-session'),
  path = require('path')
	
//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
//mongoose.connect("mongodb://localhost/yelp_camp_v10");
// mongoose.connect('mongodb://sproutsnapdb:sproutsnapdb1@ds211613.mlab.com:11613/sproutsnap1', ()=>{
//   console.log('connected to mongolab');
// });
mongoose.connect('mongodb://ensignia:ensignia1@ds213759.mlab.com:13759/ensignia2018', ()=>{
  console.log('connected to mongolab');
});
// mongoose.connect('mongodb://certificate:certificate1@ds139193.mlab.com:39193/certificates', ()=>{
// 	console.log('connected to mongolab 2');
// });
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use( express.static(path.join(__dirname , 'public')));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

//cookie session
app.use(cookieSession({
	maxAge: 24*60*60*1000,
	keys: ['shuaib']
}));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);

app.listen(process.env.PORT||8000, process.env.IP, function(){
   console.log("Server's Runnin...!");
});