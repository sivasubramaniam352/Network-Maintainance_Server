

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    var User = require('../models/userModel');
    var opts = {}
module.exports=(passport) =>{
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secretnehvaida';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
             user = jwt_payload;
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
}