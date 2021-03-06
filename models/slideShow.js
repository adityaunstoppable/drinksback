const mongoose = require("mongoose");

const slideshowSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        photo:{

            data: Buffer,
            contentType: String
        } ,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Slideshow",slideshowSchema);
