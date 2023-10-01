// top level routes, like landing page, /dashboard.ejs

const express = require('express'); // need to use router
const router = express.Router(); // function to create new router object
const { ensureAuth, ensureGuest } = require('../config/auth');

const Recipe = require('../models/Recipe');
const { formatDate, truncate, stripTags, editIcon, select } = require('../helpers/ejs');

// desc     login/landing page
// route    GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login');
});

// desc     dashboard
// route    GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.id })
        .sort({ createdAt: "desc" })
        .lean(); // limit to logged in user
        res.render('dashboard', {
            firstName: req.user.firstName,
            recipes,
            formatDate,
            truncate,
        });
    } catch (err) {
        console.err(err);
        res.status(500).render('error/500');
    }

});

module.exports = router;
