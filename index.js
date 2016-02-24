const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const Hogan = require("hogan.js");
const bodyParser = require("body-parser");
const helmet = require("helmet");

mongoose.connect("mongodb://localhost/deadend");

const Post = mongoose.model("post", {
    text: {
        type: String,
        min: 2,
        max: 10000
    },
    comments: [
        new mongoose.Schema({
            text: {
                type: String,
                min: 1,
                max: 10000
            }
        })
    ]
});

const view = Hogan.compile(
    fs.readFileSync(path.join(__dirname, "view.mustache")).toString()
);

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/", function(req, res, next) {
    Post.find(function(err, data) {
        if(!err) res.locals.posts = data;
        next();
    });
}, function(req, res) {
    res.set("Content-Type", "text/html");
    const options = Object.assign({}, app.locals, res.locals);
    res.end(view.render(options));
});

app.listen(8080);

console.log("App started!");
