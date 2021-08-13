module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You are not authenticated!');
		return res.redirect('/Login');
	}
	next();
};
