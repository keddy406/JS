const express = require("express");
const app = express();
const Post = require("./api/models/posts");
//multer = images store
var multer = require('multer');
var path = require('path')
//create storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${getExt(file.mimetype)}`)
  }
})
//consider mime picture type
const getExt = (mimetype) => {
  switch (mimetype) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpeg"

  }

}

var upload = multer({ storage: storage })
//  /api/models/posts.js
const postsData = new Post();
//frontend get api from backend need allow =>'Access-Control-Allow-Origin'
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*")
  next();
});
//endopoint /uploads
app.use('/uploads', express.static('uploads'));


//server location = http://localhost:3000/api/posts
app.get("/api/posts", (req, res) => {
  res.status(200).send(postsData.get());
});

app.get("/api/posts/:post_id", (req, res) => {
  const postId = req.params.post_id;
  const foundPost = postsData.getIndividualBlog(postId)
  if (foundPost) {
    res.status(200).send(foundPost);
  } else {
    res.status(404).send('not Found')
  }
});

app.post("/api/posts", upload.single("post_image"), (req, res) => {
  //change dicrion \\ to /
  let fileUrl = req.file.path.replace(/\\/g, "/");
  const newPost = {
    "id": `${Date.now()}`,
    "title": req.body.title,
    "content": req.body.content,
    "post_image": fileUrl,
    "added_date": `${Date.now()}`,
  }
  postsData.add(newPost)
  res.status(201).send(fileUrl);
})
//initialize server 
app.listen(3000, () => { console.log("Listening on http://localhost:3000") })