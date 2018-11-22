var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user-model");
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });
var Exhibit = require("../models/exhibit-model");

const authCheck = (req, res, next)=>{
  if(req.user){
    //logged in
    next();
  }else{
    //not logged in
    res.redirect('/');
  }
};

var adminCodes = ['anycode','any_other_code'];

//root route
router.get("/", function(req, res){
  res.render("welcome");
});

router.post("/student",(req, res)=>{
  Exhibit.find({},
    ['name','rating','url'],
    {
      skip: 0,
      sort: {
        rating: 1
      }
    },
    function(err, picOrder){
  new User({
          k: 16,
          order: picOrder,
          i: 0,
          j: 1
        }).save().then((newUser) =>{
          console.log('new user created: '+ newUser.id);
          res.redirect("/profile/"+ newUser.id);
        });
  });
});

router.post("/professor",(req, res)=>{
  Exhibit.find({},
    ['name','rating','url'],
    {
      skip: 0,
      sort: {
        rating: 1
      }
    },
    function(err, picOrder){
  new User({
          k: 32,
          order: picOrder,
          i: 0,
          j: 1
        }).save().then((newUser) =>{
          res.redirect("/profile/"+ newUser.id);
        });
  });
});

router.get("/profile/:id",(req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{
    if(foundUser.i == foundUser.order.length || foundUser.j == foundUser.order.length){
      res.redirect("/leaderboard");
    }else{
      res.render("homepage",{user: foundUser});
    }
  });
});

router.get("/i/:id",(req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{
    Exhibit.findById(foundUser.order[foundUser.i]._id , function(errr, ithex){
      Exhibit.findById(foundUser.order[foundUser.j]._id , function(error, jthex){
        var Ra, Rb, Ea, Eb;
        Ra = ithex.rating;
        Rb = jthex.rating;
        Ea = 1/(1+(Math.pow(10, (Rb-Ra)/(400))));
        Eb = 1 - Ea;

        ithex.rating = Ra + (foundUser.k)*Eb;
        ithex.save();
        jthex.rating = Rb - (foundUser.k)*Eb;
        jthex.save();
        if(foundUser.i > foundUser.j){
          foundUser.j = foundUser.i+1;
          foundUser.save();
        }else{
          foundUser.j = foundUser.j +1;
          foundUser.save();
        }
        res.redirect("/profile/"+foundUser.id);
      });
    });    
  });
});

router.get("/j/:id",(req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{
    Exhibit.findById(foundUser.order[foundUser.i]._id , function(errr, ithex){
      Exhibit.findById(foundUser.order[foundUser.j]._id , function(error, jthex){
        var Ra, Rb, Ea, Eb;
        Ra = ithex.rating;
        Rb = jthex.rating;
        Ea = 1/(1+(Math.pow(10, (Rb-Ra)/(400))));
        Eb = 1 - Ea;

        ithex.rating = Ra - (foundUser.k)*Ea;
        ithex.save();
        jthex.rating = Rb + (foundUser.k)*Ea;
        jthex.save();
        if(foundUser.i > foundUser.j){
          foundUser.i = foundUser.i+1;
          foundUser.save();
        }else{
          foundUser.i = foundUser.j +1;
          foundUser.save();
        }
        res.redirect("/profile/"+foundUser.id);
      });
    }); 
  });
});

router.get("/ij/:id",(req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{
    Exhibit.findById(foundUser.order[foundUser.i]._id , function(errr, ithex){
      Exhibit.findById(foundUser.order[foundUser.j]._id , function(error, jthex){
        var Ra, Rb, Ea, Eb;
        Ra = ithex.rating;
        Rb = jthex.rating;
        Ea = 1/(1+(Math.pow(10, (Rb-Ra)/(400))));
        Eb = 1 - Ea;

        ithex.rating = Ra + (foundUser.k)*(0.5 - Ea);
        ithex.save();
        jthex.rating = Rb + (foundUser.k)*(0.5 - Eb);
        jthex.save();
        if(foundUser.i > foundUser.j){
          foundUser.i = foundUser.i+1;
          foundUser.save();
        }else{
          foundUser.i = foundUser.j +1;
          foundUser.save();
        }
        res.redirect("/profile/"+foundUser.id);
      });
    }); 
  });
});

router.get("/leaderboard",(req, res)=>{
  Exhibit.find({},
    ['name','rating'],
    {
      skip: 0,
      sort: {
        rating: -1
      }
    },
    function(err, picOrder){
      res.render("leaderboard",{exhibits: picOrder});
  });
});









router.get("/admin",(req, res)=>{
  res.render("adminUpload", {err: "",succ: ""});
});

router.post("/adminUpload", upload.any(),(req, res)=>{
  if(adminCodes.includes(req.body.admin_code)){
    Exhibit.findOne({name: req.body.exhibit_name},function(err, foundCerti){
      if(foundCerti){
        res.render("adminUpload",{err: "A certificate already exists with the given Name"});
      }else{
        new Exhibit({
          name: req.body.exhibit_name,
          url: '/uploads/'+req.files[0].filename,
          rating: 1400,
          adminCode: req.body.admin_code
        }).save();
        res.render("adminUpload", {err: "",succ: "Successfully Uploaded "});
      }
    });
  }else{
    res.render("adminUpload", {err: "You are not an Admin of Prakriti Club !", succ:""});
  }
});

router.get("/admin/:adminCode",function(req, res){
  Exhibit.find({},function(err, allexhibits){
    res.render("adminlook",{exhibits: allexhibits});
  });
});

router.get("/admin/delete/:exhibit_name",(req,res)=>{
  Exhibit.deleteOne({name: req.params.exhibit_name}, function(err){
    if(err){
      console.log(err);
    }
    console.log("deleted");
  });
  res.redirect('/admin/anycode');
});


module.exports = router;