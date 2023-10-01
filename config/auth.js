// auth.middleware
// middleware is function that has access to req and res objects

module.exports = {
    ensureAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect('/');
        }
    },
    // if logged in and go to landing page
    // redirect to /dashboard
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        }
        else {
            return next();
        }
    },
}