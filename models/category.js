const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        description :{
          type: String,
          required: true,
          maxlength: 2000

        },
        history: {
          type: String,
          required: true,
          maxlength: 2000
        },
        photo:{

            data: Buffer,
            contentType: String
        } ,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
