const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');
const Products = require("../models/product")

exports.categoryById = (req, res, next, id) => {
    Category.findById(id)
        .exec((err, category) => {
            if (err || !category) {
                return res.status(400).json({
                    error: 'SlideShow not found'
                });
            }
            req.category = category;
            next();
        });
};

exports.read = (req, res) => {
    req.category.photo = undefined;


    return res.json(req.category);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        // check for all fields
        const { name , description ,history} = fields;

        if (!name || !description || !history) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let category = new Category(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            category.photo.data = fs.readFileSync(files.photo.path);
            category.photo.contentType = files.photo.type;
        }



        category.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};


exports.list = (req, res) => {

    Category.find()
.sort({"name":1})
        .select('-photo')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

exports.photo = (req, res, next) => {
  if (req.category.photo.data) {
      res.set('Content-Type', req.category.photo.contentType);
      return res.send(req.category.photo.data);
  }
    next();
};
