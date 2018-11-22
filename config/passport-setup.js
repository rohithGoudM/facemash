const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user-model.js');

passport.serializeUser((user, done)=>{
	done(null, user.id);
});

passport.deserializeUser((id, done)=>{
	User.findById(id).then((user)=>{		
		done(null, user);
	});
});


passport.use(
	new GoogleStrategy({
	//options for the g strat
		callbackURL: '/auth/google/redirect',
		clientID: 'CLIENT_ID',
		clientSecret: 'CLIENT_SECRET'
	}, (accessToken, refreshToken, profile, done)=>{
		//passport callback
		User.findOne({googleId: profile.id}).then((currentUser)=>{
			if(currentUser){
				//already exists in db
				console.log('user is '+ currentUser);
				done(null, currentUser);
			}else{
				//if not, create user in our db
				new User({
					username: profile.displayName,
					googleId: profile.id
				}).save().then((newUser) =>{
					console.log('new user created: '+ newUser);
					done(null, newUser);
				});
			}
		});
		
		
	})
	
)

//Facebook

passport.use(new FacebookStrategy({
    clientID: '455472564946078',
    clientSecret: 'bda8535831588e2dad8fa2db858e4754',
    callbackURL: '/auth/facebook/redirect'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({facebookId: profile.id}).then((currentUser)=>{
			if(currentUser){
				//already exists in db
				done(null, currentUser);
			}else{
				//if not, create user in our db
				new User({
					username: profile.displayName,
					facebookId: profile.id
				}).save().then((newUser) =>{
					done(null, newUser);
				});
			}
		});
  }
));