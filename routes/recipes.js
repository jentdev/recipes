const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../config/auth");
const Recipe = require("../models/Recipe");
// helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('../helpers/ejs');

// @desc    show add page
// @route   GET /recipes/add
// added ensureGuest, because only guests should be able to see this
router.get("/add", ensureAuth, (req, res) => {
// console.log(`add req ${req.body}`);
  res.render("recipes/add");
});

// @desc    process add form
// @route   POST /recipes
// added ensureGuest, because only guests should be able to see this
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Recipe.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    show all recipes
// @route   GET /recipes
// added ensureGuest, because only guests should be able to see this
router.get("/", ensureAuth, async (req, res) => {
  try {
    console.log(req.user._id);
    const recipes = await Recipe.find({
      status: 'public'
    })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean(); //to pass to template
    res.render("recipes/index", {
      recipes,
      // user: req.user._id, // pass id of logged in user to recipes.ejs. can use middleware func to set global var
      truncate,
      stripTags,
      editIcon,
    });
    //  console.log('req', req);
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    show single Recipe
// @route   GET /recipes/:id
// fetch Recipe from db
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('user')
      .lean();

      // check if Recipe is there or not
      if (!recipe) {
        return res.render('error/404');
      }

      res.render('recipes/show', {
        recipe,
        formatDate,
        editIcon,
        // user: req.user._id // used global var
      });
  }
  catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

// @desc    show all recipes from single user
// @route   GET /recipes/user/:userId
router.get('/user/:_id', ensureAuth, async (req, res) => {
  try {
    const recipes = await Recipe.find({
      user: req.params,
      status: 'public',
    })
    .populate('user')
    .lean();

    res.render('recipes/index', {
      recipes,
      editIcon,
      truncate,
      stripTags,
      // user: req.user._id // used global var
    })
  }

  catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

// @desc    show edit page
// @route   GET /recipes/edit/:id
// added ensureGuest, because only guests should be able to see this
router.get("/edit/:id", ensureAuth, async (req, res) => {
// console.log('req', req);
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id
    }).lean();
    // console.log('Req" ', req);
    // console.log('params.id', req.params.id);
    // console.log(`posted by user ${Recipe.user._id}`); // posted by user
    // console.log(req.user._id); // logged in user
    // console.log((Recipe.user._id).toString() == (req.user._id).toString());
    // console.log('Recipeeeeee ', Recipe);
    // console.log('Recipe id to string ', (Recipe._id).toString());
    if (!recipe) {
      return res.render('error/404');
    }
    if ((recipe.user._id).toString() != (req.user._id).toString()) {
      res.redirect('/recipes'); // absolute path. starting point is fixed. this will go to /recipes route
    }
    else {
      res.render('recipes/edit', { // relative path. starting point is current directory (where recipes.js is). which will go to views folder to find recipes/edit.ejs
        recipe,
        select,
      });
    }
  }
  catch (err) {
    console.error(err);
    return res.render('error/500');
  }  
});

// @desc    update Recipe
// @route   PUT /recipes/:id
// added ensureGuest, because only guests should be able to see this
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id).lean();

    if (!recipe) {
      return res.render('error/404');
    }

    //  console.log('params.id', req.params.id);
    // console.log('posted by user', Recipe.user._id);
    // console.log('req.body', req.body);
    if ((recipe.user._id).toString() != (req.user._id).toString()) {
      res.redirect('/recipes');
    }
    else {
      recipe = await Recipe.findOneAndUpdate({ _id: req.params.id}, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard');
    }
  }
  catch (err) {
    console.error(err);
    return res.render('error/500');
  }  
});

// @desc    delete page
// @route   DELETE /recipes/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Recipe.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } 
  catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

module.exports = router;
// bring in routes in server.js to use
