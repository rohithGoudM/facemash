var express = require("express");
var router  = express.Router();
const Skill = require('../models/skill-model')
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
const mongoose = require('mongoose');
var User = require("../models/user-model");
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

//profile home

router.get("/:teamName", authCheck, (req, res)=>{
	//coming soon
	Team.findOne({teamName: req.params.teamName}, function(err, foundTeam){
		User.find({teamName: req.params.teamName}, function(error, teamMem){
		if(foundTeam.teamCode == req.user.id){
			res.render("coming-soon",{user: req.user, creator: true, teamMem: teamMem});
		}else{
			res.render("coming-soon",{user: req.user, creator: false, teamMem: teamMem});
		}
	});
	});
});




module.exports = router;