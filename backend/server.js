const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const DBName = "micro-blogos";
const MONGOPort = "27042";
const PORT = 4242;


app.use(cors());
app.use(bodyParser.json());
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send('error');//this or res.status(err.status || 500).send('error')
});

mongoose.connect('mongodb://127.0.0.1:' + MONGOPort + '/' + DBName, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully on port : " + MONGOPort + ", data base name : " + DBName + ".");
});
const memberFunc = require('./server-member');
const memberRoutes = express.Router();
memberRoutes.route('/register').post(memberFunc.PostRegister);
memberRoutes.route('/login').post(memberFunc.PostLogin);
memberRoutes.route('/profile/:login').get(memberFunc.GetProfileLogin);
memberRoutes.route('/profile/:login').post(memberFunc.PostProfileLogin);
memberRoutes.route('/update/:login').get(memberFunc.getUpdateLogin);
memberRoutes.route('/update/:login').post(memberFunc.PostUpdateLogin);
memberRoutes.route('/list').get(memberFunc.getList);
memberRoutes.route('/:id').get(memberFunc.GetID);
app.use('/member', memberRoutes);

const postFunc = require('./server-post');
const postRoutes = express.Router();
postRoutes.route('/create').post(postFunc.PostCreate);
postRoutes.route('/list').get(postFunc.PostList);
postRoutes.route('/my-blog/:login').get(postFunc.PostMyBlog);
postRoutes.route('/received-list/:login').get(postFunc.PostRecieved);
postRoutes.route('/search-by-key-words/:keyword').get(postFunc.PostSearchKeyword);
postRoutes.route('/key-words-list').get(postFunc.PostKeywordList);
postRoutes.route('/update/:id').get(postFunc.GetPostUpdate);
postRoutes.route('/update/:id').post(postFunc.PostPostUpdate);
postRoutes.route('/post/DELETE/:id').get(postFunc.Post_DELETE);
app.use('/post', postRoutes);

app.listen(PORT, function () {
       console.log("Server is running on Port: " + PORT);
});