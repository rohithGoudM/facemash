var express = require("express");
var router  = express.Router();
const passport = require('passport');


// auth login
router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// auth with google
router.get('/google', passport.authenticate('google', {
	scope: ['profile']
}),()=>{
	
	console.log('callback uri');
});

//callback route for g+ to redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res)=>{
	res.redirect('/team');
});

// auth with facebook
router.get('/facebook', passport.authenticate('facebook', { 
	scope: 'email' 
}));

//callback route for fb to redirect
router.get('/facebook/redirect',
  passport.authenticate('facebook'), (req, res)=>{
  	res.redirect('/team');
  });

module.exports = router;