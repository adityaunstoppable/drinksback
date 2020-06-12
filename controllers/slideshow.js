const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Slideshow = require('../models/slideshow');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.slideshowById = (req, res, next, id) => {
    Slideshow.findById(id)
        .exec((err, slideshow) => {
            if (err || !slideshow) {
                return res.status(400).json({
                    error: 'SlideShow not found'
                });
            }
            req.slideshow = slideshow;
            next();
        });
};

exports.read = (req, res) => {
    req.slideshow.photo = undefined;
    return res.json(req.slideshow);
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
        const { name } = fields;

        if (!name) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let slideshow = new Slideshow(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            slideshow.photo.data = fs.readFileSync(files.photo.path);
            slideshow.photo.contentType = files.photo.type;
        }



        slideshow.save((err, result) => {
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

    Slideshow.find()
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
  if (req.slideshow.photo.data) {
      res.set('Content-Type', req.slideshow.photo.contentType);
      return res.send(req.slideshow.photo.data);
  }
    next();
};
