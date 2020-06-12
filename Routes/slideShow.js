const express = require('express');
const router = express.Router();

const { create, slideshowById, read ,list,photo } = require('../controllers/slideshow');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/slideshow/:slideshowId', read);
router.post('/slideshow/create/:userId', requireSignin, isAuth, isAdmin, create);
// router.put('/category/:categoryUpdateId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/slideshow', list);
router.get("/slideshow/photo/:slideshowId", photo);

router.param('slideshowId', slideshowById);
router.param('userId', userById);

module.exports = router;
