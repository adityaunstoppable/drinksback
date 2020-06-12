const express = require('express');
const router = express.Router();

const { create, categoryById, read, update, remove, list , photo} = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
// router.put('/category/:categoryUpdateId/:userId', requireSignin, isAuth, isAdmin, update);

router.get("/category/photo/:categoryId", photo);
router.get('/categories', list);
router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;
