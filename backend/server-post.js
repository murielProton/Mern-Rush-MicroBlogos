var funct = require('./server-post-function');
const express = require('express');
const postRoutes = express.Router();
let Post = require('./model.post');


/* DEBUT des ROUTES POSTS--------------------------------------------------------------------*/
//http://127.0.0.1:4242/post/create
exports.PostCreate = async function (req, res) {
    let post = new Post(req.body);
    let errors = await funct.generateErrorsForPostsCreate(req);
    console.log("errors length " + errors.length);
    if (errors.length > 0) {
        res.status(200).json({ 'errors': errors });
        return;
    }
    listOfRecipients = await funct.findListOfRecipients(req);
    if (listOfRecipients.length == 0) {
        post.recipients= [];
    }else {
        post.recipients = listOfRecipients;
    }
    listOfKeyWords = funct.findKeyWords(funct.findWordsStartingWithHashtag(req.body.content));
    console.log("Number of char in listOfKeyWords =" + listOfKeyWords.length)
    if (listOfKeyWords.length == 0) {
        post.key_words = [];
    }else {
        post.key_words = listOfKeyWords;
        console.log(listOfKeyWords);
    }
    {
        post.save()
            .then(post => {
                res.status(200).json({ 'route': '/post/create', 'status': "OK", 'post': 'post added successfully' });
                //attention les redirects ne se font pas du côté server mais du côté component !!!! reférence create-memeber.component
            })
            .catch(errors => {
                console.log(errors);
                res.status(200).send({ 'errors': ["Technical error"] });
            });
    }
}
//http://localhost:4242/post/list
exports.PostList = async function (req, res) {
    let postsList = await Post.find().sort({ date: -1 });
    let errors = [];
    if (postsList.length == 0) {
        errors = "no posts in data base."
        errors.push("no posts in data base.");
        console.log(errors);
        res.status(200).json({ 'route': '/list', 'status': 'KO', 'errors': errors });
        return (errors);
    } else {
        res.json(postsList);
    }
}
//'http://localhost:4242/post/my-blog/:ID
exports.PostMyBlog = async function (req, res) {
    let login = req.params.login;
    let postsList = await Post.find({ author: "@" + login }).sort({ date: -1 });
    let errors = [];
    if (postsList.length == 0) {
        errors = "no posts in data base."
        errors.push("no posts in data base.");
        console.log(errors);
        res.status(200).json({ 'route': '/my-blog/:login', 'status': 'KO', 'errors': errors });
        return (errors);
    } else {
        res.json(postsList);
    }
}
//http://localhost:4242/post/received-list/:ID
exports.PostRecieved = async function (req, res) {
    let login = req.params.login;
    console.log(login + " in my list");
    let postsList = await Post.find({ recipients: login }).sort({ date: -1 });
    let errors = [];
    if (postsList.length == 0) {
        console.log("no posts in data base.");
        errors.push("no posts in data base.");
        console.log(errors);
        res.status(200).json({ 'route': 'received-list/:login', 'status': 'KO', 'errors': errors });
        return (errors);
    } else {
        res.json(postsList);
    }
}
//http://localhost:4242/post/search-by-key-words
exports.PostSearchKeyword = async function (req, res) {
    let keyword = req.params.keyword;
    console.log(keyword + " in my list");
    let postsList = await Post.find({ key_words: keyword }).sort({ date: -1 });
    let errors = [];
    if (postsList.length == 0) {
        console.log("no posts in data base.");
        errors.push("no posts in data base.");
        console.log(errors);
        res.status(200).json({ 'route': 'search-by-key-words', 'status': 'KO', 'errors': errors });
        return (errors);
    } else {
        res.json(postsList);
    }
}
//http://localhost:4242/post/key-words-list
exports.PostKeywordList = async function (req, res) {
    let listOfKeyWords = await funct.findAllKeyWords();
    res.status(200).json({ 'keywords': listOfKeyWords });
}
//http://127.0.0.1:4242/post/update/:id
exports.GetPostUpdate = async function (req, res) {
    let postsList = await Post.find({ _id: req.params.id });
    let errors = [];
    console.log("in server post update posts list" + postsList)
    console.log("in server post update errors " + errors)
    if (postsList.length > 0) {
        res.status(200).json({ 'route': '/update/:login', 'errors': errors, 'post': postsList[0] });
    } else {
        errors.push("No posts in data base.");
        res.status(200).json({ 'route': '/update/:login', 'errors': errors, 'post': {} });
    }
}
exports.PostPostUpdate =async function (req, res) {
    console.log("je suis dans update post Post Routes");
    let postsList = await Post.find({ _id: req.params.id });
    let post = postsList[0];
    let errors = await funct.generateErrorsForPostsCreate(req);
    let id = req.params.id;
    let content = req.body.content;
    const filterId = { _id: id };
    console.log("filterId =" + filterId);
    console.log("errors =" + errors);
    if (filterId == undefined || filterId == null) {
        errors.push("filterId data is not found");
        console.log("errors =" + errors);
        res.status(200).json({ 'route': '/update/:id', 'errors': errors });
        return;
    }
    if (errors.length > 0) {
        res.status(200).json({ 'errors': errors })
        console.log("errors = " + errors);
        return;
    } else {
        const contentToUpdate = { content: content };
        const doc = await Post.findOneAndUpdate(filterId, contentToUpdate, { $set: { useFindAndModify: false } });
        console.log("contentToUpdate =" + contentToUpdate);//udefined
        console.log("contentToUpdate =" + contentToUpdate[1]);
        console.log("contentToUpdate =" + contentToUpdate[2]);
        console.log("doc =" + doc);
        doc.save().then(post => {
            res.status(200).json({ 'route': '/my-blog/:login', 'status': "OK", 'post': 'post updated successfully' });
        })
            .catch(err => {
                errors.push("Post update not possible");
                res.status(200).json({ 'route': '/update/:id', 'status': 'KO', 'errors': errors });
            })
        console.log("errors =" + errors);
    }
}
//http://localhost:4242/post/post/DELETE/:id
exports.Post_DELETE = async function (req, res) {
    let errors = [];
    let postID = req.params.id;
    let postToDELETE = await Post.findByIdAndRemove({ _id: postID });
    console.log("server post DELETE errors : " + errors);
    console.log("server post DELETE post id : " + postID);
    console.log("server post DELETE postToDELETE : " + postToDELETE);
    Post.findByIdAndRemove({ _id: postID }, function (errors, business) {
        if (errors) {
            console.log("server post DELETE errors : " + errors);
            res.status(200).json({ 'route': '/my-blog/:login', 'status': 'KO', 'errors': errors });
        }
        else {
            res.status(200).json({ 'route': '/my-blog/:login', 'status': 'OK', 'errors': errors });
        };
    });
}
