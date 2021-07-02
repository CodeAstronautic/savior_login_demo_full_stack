module.exports = {
    ensureAuthenticated: (req, res, next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Please login to view this resourse');
        res.redirect('/users/login');
    }
}