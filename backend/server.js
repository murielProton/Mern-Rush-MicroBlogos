const express = require('express');
const crypto = require('crypto');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4242;
const DBName = "micro-blogos";
const MONGOPort = "27042";
const memberRoutes = express.Router();
const postRoutes = express.Router();

let Member = require('./model.member');
let Post = require('./model.post');

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
/*DEBUT DES ROUTTES MEMBER---------------------------------------------------------------------------------*/
//http://127.0.0.1:4242/member/register
memberRoutes.route('/register').get(function (req, res) {
    //res.render('create-member.component');
});
memberRoutes.route('/register').post(async function (req, res) {
    let member = new Member(req.body);
    //gestion des erreurs Mern d03 attention l'affichage utilisateur se gère coté app.js ou component.js
    let errors = await generateErrorsForRegister(req, member);
    if (errors.length > 0) {
        res.status(200).json({ 'errors': errors })
        return;
    } else {
        member.password = toSha1(member.password);
        member.save()
            .then(member => {
                res.status(200).json({ 'route': '/login', 'status': "OK", 'member': 'member added successfully' });
                //attention les redirects ne se font pas du côté server mais du côté component !!!! reférence create-memeber.component
            })
            .catch(err => {
                res.status(200).send({ 'errors': ["Technical error"] });
            });
    }
});
//http://127.0.0.1:4242/member/login
memberRoutes.route('/login').get(function (req, res) {
    res.status(200).json({});
});
memberRoutes.route('/login').post(async function (req, res) {
    console.log(req.body.login);
    console.log(req.body.password);
    //Attention toute interaction avec bdd doit se faire ici
    //vérifier que le login correspond à l'un des membres en bdd
    let members = await Member.find({ login: req.body.login });
    let errors = [];
    if (members.length == 0) {
        console.log("Incorrect Login");
        errors.push("Failliure in connection or Incorrect Password or Login");
        res.status(200).json({ 'route': '/login', 'status': "KO", 'errors': errors });
        //Arret de la stack ici
        throw errors;
    } else {
        console.log(await members);
        let member = await members[0];
        //vérifier si les deux mots de passe hacher sont identiques
        console.log(member.password);
        console.log(toSha1(req.body.password));
        if (member.password == toSha1(req.body.password)) {
            console.log("You are now connected as " + req.body.login);
            // ATTENTION LES REDIRECTS ROOTS SONT DU COTE COMPONENT
            res.status(200).json({ 'route': '/post/create', 'status': 'OK', 'member': req.body.login + ' connected successfully' });
        } else {
            console.log("Failliure in connection or Incorrect Password");
            errors.push("Failliure in connection or Incorrect Password or Login");
            res.status(200).json({ 'route': '/login', 'status': 'KO', 'errors': errors });
            throw errors;
        }
    }
});
//http://127.0.0.1:4242/member/profile/:login
memberRoutes.route('/profile/:login').get(function (req, res) {
    Member.find({ login: req.params.login }, function (errors, members) {
        if (members.length > 0) {
            res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'member': members[0] });
        } else {
            errors.push("No members with this login in data base.");
            res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'member': {} });
        }
    });
});
memberRoutes.route('/profile/:login').post(function (req, res) {
    Member.find({ login: req.params.login }, function (errors, members) {
        if (members.length > 0) {
            res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'member': members[0] });
        } else {
            errors.push("No members with this login in data base.");
            res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'member': {} });
        }
    });
});
//http://127.0.0.1:4242/member/update/:login
memberRoutes.route('/update/:login').get(async function (req, res) {  
    let membersList = await Member.find({ login: req.params.login });
    let errors = [];
    if (membersList.length > 0) {
        res.status(200).json({ 'route': '/update/:login', 'errors': errors, 'member': membersList[0] });
    } else {
        errors.push("No members with this login in data base.");
        res.status(200).json({ 'route': '/update/:login', 'errors': errors, 'member': {} });
    }
});
memberRoutes.route('/update/:id').post(async function (req, res) {
    let errors = [];
    console.log("errors =" + errors);
    console.log(req.body);
    let login = req.body.login;
    console.log("post update Login = " + login);
    let email = req.body.email;
    console.log("post update email = " + email);
    const filterLogin = { login: login };
    let membersList = await Member.find({ login: req.body.login });
    if (filterLogin == undefined || filterLogin == null) {
        errors.push("data is not found");
        console.log("errors =" + errors);
        res.status(200).json({ 'route': '/update/:id', 'errors': errors });
    } else {
        const emailToUpdate = { email: email };
        const doc = await Member.findOneAndUpdate(filterLogin, emailToUpdate);
        console.log(doc);
        res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'status': 'OK', 'member': "member updated successfully" })
    }
    /*Member.findOneAndUpdate(req.params.login, function (err) {
        let member = membersList[0];
        console.log("member =" + member);
        //member est vide
        if (!member) {
            errors.push("data is not found");
            console.log("errors =" + errors);
            res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'member': membersList[0] });
        } else {
            member.member_email = req.body.member_email;
            member.save().then(member => {
                res.status(200).json({ 'route': '/update/:login', 'status': "OK", 'member': 'member updated successfully' });
            })
                .catch(err => {
                    errors.push("Update not possible");
                    res.status(200).json({ 'route': '/update/:login', 'status': 'KO', 'errors': errors });
                })
            console.log("errors =" + errors);
        }
    });*/
});
memberRoutes.route('/list').get(async function (req, res) {
    let membersList = await Member.find();
    let errors = [];
    if (membersList.length == 0) {
        errors = "no members in data base.";
        errors.push("no members in data base.");
        console.log(errors);
        res.status(200).json({ 'route': '/list', 'status': 'KO', 'errors': errors });
        return (errors);
    } else {
        res.json(membersList);
    }
});
memberRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Member.findById(id, function (err, members) {
        res.json(members);
    });
});
app.use('/member', memberRoutes);
/*FIN DES ROUTTES MEMBER---------------------------------------------------------------------------------*/


/* DEBUT des FONCTIONS UTILES MEMBERS--------------------------------------------------------------------*/
//login entre 5 et 20 char
function isCurentOftheRightLength(req) {
    let lengthOfCurLogin = (req.body.login).length;
    if (lengthOfCurLogin < 5 || lengthOfCurLogin > 20) {
        return false;
    } else {
        return true;
    }
}
async function isNewLoginSameAsOldLogin(req) {
    let loginListMember = await Member.find({ login: req.body.login });
    if (loginListMember.length == 1) {
        return true;
    } else {
        return false;
    }
}
async function isNewEmailSameAsOldEmail(req) {
    let emailListMember = await Member.find({ email: req.body.email });
    if (emailListMember.length == 1) {
        return true;
    } else {
        return false;
    }
}
//login unique in collection
async function isLoginUniqueInCollection(req) {
    let loginListMember = await Member.find({ login: req.body.login });
    if (loginListMember.length > 0) {
        return false;
    } else {
        return true;
    }
}
// email unique in collection
async function isEmailUniqueInCollection(req) {
    let emailListMember = await Member.find({ email: req.body.email });
    if (emailListMember.length > 0) {
        return false;
    } else {
        return true;
    }
}
// email = regex email
async function isEmailValid(req) {
    const regexMail = RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+\.[a-zA-Z0-9_.-]{2,5}$');
    if (!regexMail.test(req.body.email)) {
        return false;
    } else {
        return true;
    }
}

async function generateErrorsForRegister(req) {
    console.log("je rentre dans la fonciton generate Errors");
    let errors = [];
    /** DEBUT : On fait les contrôles */
    if (isCurentOftheRightLength(req) == false) {
        errors.push("your login takes more than 5 character and less than 20.")
    }
    if (await isLoginUniqueInCollection(req) == false) {
        errors.push("Your login is already in data base, please enter an other.")
    }
    if (await isEmailUniqueInCollection(req) == false) {
        errors.push("Your email is already in data base, please enter an other.")
    }
    if (await isEmailValid(req) == false) {
        errors.push("This email : " + req.body.email + ", is not valid.");
    }
    var curentPassword = req.body.password;
    var tropPetit = curentPassword.length < 6;
    if (tropPetit) {
        errors.push("For security reasons your password must contain at least 6 characters.");
    }
    var curentPasswordConf = req.body.password_confirmation;
    if (curentPassword != curentPasswordConf) {
        console.log("je passe dans le if le password est différent de password confirmation");
        errors.push("password  confirmation invalid.");
    }
    /** FIN : On fait les contrôles **/
    return errors;
}
function toSha1(password) {
    // On crée notre Hasher avec l'algo qu'on veux
    var shasum = crypto.createHash('sha1');
    // ce qu'on veux hasher
    shasum.update(password);
    // hex => Format de retour hex 012345679abcdef (base 16)
    return shasum.digest('hex');
}
async function passwordVerification(req, member) {
    //vérifier si les deux mots de passe hacher sont identiques
    if (member.password == toSha1(req.body.password)) {
        return true
    } else {
        return false;
    }
}
//TODO Make it true n'importe quel champ doit pouvoir être testé
async function isFormFieldCompleted(req) {
    if (req.body.password == undefined || req.body.password == null) {
        return false;
    } else {
        return true;
    }
}
async function generateErrorsForUpdate(req, member) {
    let errors = [];
    let login = req.body.login;
    console.log(login);
    if (await isNewEmailSameAsOldEmail(req)) {
        errors.push("Not an Update !");
        console.log(errors);
    }
    if (await isEmailUniqueInCollection(req) == false) {
        errors.push("Your email is already in data base, please enter an other.")
        console.log(errors);
    }
    if (await isEmailValid(req) == false) {
        errors.push("This email : " + req.body.email + ", is not valid.");
        console.log(errors);
    }
    if (isFormFieldCompleted(req) == false) {
        error.push("please enter your password.");
        console.log(errors);
    }
    if (await passwordVerification(req, member) == false) {
        errors.push("Incorrect password.");
        console.log(errors);
    }
    return errors;
}

/* FIN des FONCTIONS UTILES MEMBERS--------------------------------------------------------------------*/
/* DEBUT des ROUTES POSTS--------------------------------------------------------------------*/
//http://127.0.0.1:4242/post/create
postRoutes.route('/create').get(function (req, res) {
    //res.render('create-post.component');
});
postRoutes.route('/create').post(async function (req, res) {
    let post = new Post(req.body);
    let errors = await generateErrorsForPostsCreate(req);
    console.log("errors length " + errors.length);
    if (errors.length > 0) {
        res.status(200).json({ 'errors': errors });
        return;
    }
    listOfRecipients = await findListOfRecipients(req);
    if (listOfRecipients.length > 0) {
        post.recipients = listOfRecipients;
    }
    listOfKeyWords = findKeyWords(findWordsStartingWithHashtag(req.body.content));
    console.log("Number of char in listOfKeyWords =" + listOfKeyWords.length)
    if (listOfKeyWords.length > 0) {
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
});
//http://localhost:4242/post/list
postRoutes.route('/list').get(async function (req, res) {
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
});
//'http://localhost:4242/post/my-blog/:ID
postRoutes.route('/my-blog/:login').get(async function (req, res) {
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
});
//http://localhost:4242/post/received-list/:ID
postRoutes.route('/received-list/:login').get(async function (req, res) {
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
});
/*http://localhost:4242/post/post/delete/:ID
postRoutes.route('/post/delete/:_id').get(async function (req, res){
    let login = req.params.login;
    let postID = req.params._id;
    let postToDELETE = ;
})*/
//http://localhost:4242/post/search-by-key-words
postRoutes.route('/search-by-key-words/:keyword').get(async function (req, res) {
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
});
//http://localhost:4242/post/key-words-list
postRoutes.route('/key-words-list').get(async function (req, res) {
    let listOfKeyWords = await findAllKeyWords();
    res.status(200).json({ 'keywords': listOfKeyWords });
});
app.use('/post', postRoutes);
/* FIN des ROUTES POSTS--------------------------------------------------------------------*/
/* DEBUT des FONCTIONS UTILES POSTS---------------------------------------------------------------*/
async function doesMyPostHaveEnoughChar(req) {
    var curentContent = req.body.content;
    if (curentContent !== undefined) {
        console.log("On a un curentContent");
    }
    if (curentContent !== undefined && curentContent.length > 5) {
        console.log("On retroune true dans doesMyPostHasEnoughChar")
        return true;
    }
    return false;
}
async function doesMyPostHaveTooManyChar(req) {
    var curentContent = req.body.content;
    if (curentContent.length >= 140) {
        console.log("On retroune true dans doesMyPostHave TooMany Char")
        return true;
    }
    return false;
}
async function doesMyAuthorHaveAArrobass(req) {
    var curentAuthor = req.body.author;
    if (curentAuthor !== undefined) {
        console.log("on a un curent Author.");
    } if (curentAuthor !== undefined && curentAuthor.startsWith("@")) {
        return true;
    }
    return false;
}
async function doesMyPostHaveTooManyChar(req) {
    var curentContent = req.body.content;
    if (curentContent.length >= 140) {
        return true;
    }
    return false;
}
async function generateErrorsForPostsCreate(req) {
    let errors = [];
    if (await doesMyPostHaveEnoughChar(req) == false) {
        errors.push("Your post must at leest be 5 char long.");
        console.log("Your post must at leest be 5 char long.");
    }
    if (await doesMyAuthorHaveAArrobass(req) == false) {
        errors.push("Technical error with your login.");
        console.log("Problem of @ on variable Author, see post-creator.");
    }
    if (await doesMyPostHaveTooManyChar(req) == true) {
        errors.push("Your post must not be longer than 140 char.");
        console.log("Problem of @ on variable Author, see post-creator.");
    }
    return errors;
}
function findWordsInPosts(content) {
    const listOfWords = [];
    content.split(" ").forEach(element => {
        listOfWords.push(element);
    });
    return listOfWords;
}
function findWordsStartingWithArobass(content) {
    const listOfWords = findWordsInPosts(content);
    const listOfMayBeRecipient = [];
    for (var i = 0; i < listOfWords.length; i++) {
        if (listOfWords[i].startsWith("@")) {
            listOfMayBeRecipient.push(listOfWords[i]);
        }
    }
    return listOfMayBeRecipient;
}
function getListOfRecipientsFromLists(potentielRecipients, members) {
    const listOfRecipients = [];
    if (potentielRecipients.length > 0) {
        for (var i = 0; i < potentielRecipients.length; i++) {
            for (var y = 0; y < members.length; y++) {
                if (potentielRecipients[i] == "@" + members[y].login) {
                    listOfRecipients.push(members[y].login);
                }
            }
        }
    }
    return listOfRecipients;
}
async function findListOfRecipients(req) {
    listOfMayBeRecipient = findWordsStartingWithArobass(req.body.content);
    listOfMembers = await Member.find();
    return getListOfRecipientsFromLists(listOfMayBeRecipient, listOfMembers);
}
function findWordsStartingWithHashtag(content) {
    const listOfWords = findWordsInPosts(content);
    const listOfMayBeKeyWords = [];
    for (var i = 0; i < listOfWords.length; i++) {
        if (listOfWords[i].startsWith("#")) {
            // On fait un .substr(1) pour enlever le #
            listOfMayBeKeyWords.push(listOfWords[i].substr(1));
        }
    }
    return listOfMayBeKeyWords;
}
function findKeyWords(array) {
    const listOfMayBeKeyWords = array;
    const listOfKeywords = [];
    listOfMayBeKeyWords.forEach(element => {
        if (element.length > 1) {
            listOfKeywords.push(element);
            console.log("words with more than one char : " + element)
        }
    });
    return listOfKeywords;
}
async function findAllKeyWords() {
    //const listOkKeyWordsObject = await Post.find({},"key_words");
    const listOkKeyWordsObject = await Post.find().select('key_words');
    let toReturn = new Set();
    listOkKeyWordsObject.forEach(element => {
        element.key_words.forEach(keyword => {
            toReturn.add(keyword);
        });
    });
    console.log(toReturn);
    console.log(Array.from(toReturn));
    return Array.from(toReturn);
}
/* FIN des FONCTIONS UTILES POSTS---------------------------------------------------------------*/
app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});