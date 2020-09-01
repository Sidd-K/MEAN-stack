const path = require('path');
const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

// const Post = require('./model/post');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');



const app = express();

mongoose.connect("mongodb+srv://sid:HzmFr5hAktqUWMEZ@cluster0-7mbte.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(()=>{
  console.log("Connected to Database");
})
.catch(()=>{
  console.log("connection failed");
});

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended : false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods"," GET, POST, DELETE, PATCH, PUT, OPTIONS ");
  next();
});

/*
app.get("/api/posts", (req, res, next)=>{
  Post.find().then(document =>{
    res.status(200).json({
      message : "Post fetched successfully",
      posts : document
    });
  });
});

app.post("/api/posts", (req,res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost =>{
    res.status(201).json({
    message : 'Post added succesfully',
    postId : createdPost._id
    });
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const post =  new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content });
  Post.updateOne({_id: req.params.id}, post).then(result =>{
    res.status(200).json({message: "update sussccess"});
  })
});

app.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "post not found"});
    }
  });
});


app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({
      message : "Post deleted"});
  });
});
*/
app.use("/api/posts", postRoutes);userRoutes
app.use("/api/user", userRoutes);

module.exports = app;
