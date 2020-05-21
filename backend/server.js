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
memberRoutes.route('/update/:id').post(function (req, res) {
    Member.findById(req.params.id, function (err, member) {
        if (!member) {
            res.status(404).send(member + " is not found");
            //res.render('edit-member.component');
        } else {
            member.member_email = req.body.member_email;
            member.save().then(member => {
                res.json('Your email has been updated!');
                //res.render('edit-member.component');
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                    //res.render('edit-member.component');
                });
        }
    });
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
    console.log("Number of char in listOfRecipients ="+listOfRecipients.length)
    if (listOfRecipients.length > 0) {
        post.recipients = listOfRecipients;
    }

    {
        post.save()
            .then(post => {
                res.status(200).json({ 'route': '/post/create', 'status': "OK", 'post': 'post added successfully' });
                //attention les redirects ne se font pas du côté server mais du côté component !!!! reférence create-memeber.component
            })
            .catch(errors => {
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
postRoutes.route('/list/:id').post(function (req, res) {
    //res.render('create-member.component');
});
//http://127.0.0.1:4242/post/my-list/:login
postRoutes.route('/my-list/:login').get(async function (req, res) {
    let login = req.params.login;
    console.log(login +" in my list");
    let postsList = await Post.find({author :"@"+login}).sort({ date: -1 });
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
//http://127.0.0.1:4242/post/details:id
postRoutes.route('/details:id').get(function (req, res) {
    //res.render('create-member.component');
});
postRoutes.route('/:id').post(function (req, res) {
    //res.render('create-member.component');
});
//http://127.0.0.1:4242/post/:id/update
postRoutes.route('/:id/update').get(function (req, res) {
    //res.render('create-member.component');
});
postRoutes.route(':id/update').post(function (req, res) {
    //res.render('create-member.component');
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
/*async function doesMyPostHaveDate(req) {
    var curentDate = req.body.date;
    console.log("date server ="+req.body.date)
    if (curentDate instanceof Date) {
        return true;
    } 
    return false;
}*/
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
    /*if (await doesMyPostHaveDate(req) == false ){
        errors.push("Technical error.");
        console.log("Problem with date.");
    }*/
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

function getListOfRecipientsFromLists(potentielRecipients, members){
    const listOfRecipients = [];
    if (potentielRecipients.length > 0) {
        for (var i = 0; i < potentielRecipients.length; i++) {
            for (var y = 0; y < members.length; y++) {
                if (potentielRecipients[i] == "@"+members[y].login) {
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
/* FIN des FONCTIONS UTILES POSTS---------------------------------------------------------------*/
app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});