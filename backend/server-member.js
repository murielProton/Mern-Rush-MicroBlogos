var funct = require('./server-member-function');

let Member = require('./model.member');

//http://127.0.0.1:4242/member/register
exports.PostRegister = async function (req, res) {
    let member = new Member(req.body);
    //gestion des erreurs Mern d03 attention l'affichage utilisateur se gère coté app.js ou component.js
    let errors = await funct.generateErrorsForRegister(req, member);
    if (errors.length > 0) {
        res.status(200).json({ 'errors': errors })
        return;
    } else {
        member.password = funct.toSha1(member.password);
        member.save()
            .then(member => {
                res.status(200).json({ 'route': '/login', 'status': "OK", 'member': 'member added successfully' });
                //attention les redirects ne se font pas du côté server mais du côté component !!!! reférence create-memeber.component
            })
            .catch(err => {
                res.status(200).send({ 'errors': ["Technical error"] });
            });
    }
}
//http://127.0.0.1:4242/member/login
exports.PostLogin = async function (req, res) {
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
        console.log(funct.toSha1(req.body.password));
        if (member.password == funct.toSha1(req.body.password)) {
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
}

//http://127.0.0.1:4242/member/profile/:login
exports.GetProfileLogin = function (req, res) {
    Member.find({ login: req.params.login }, function (errors, members) {
        if (members.length > 0) {
            res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'member': members[0] });
        } else {
            errors.push("No members with this login in data base.");
            res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'member': {} });
        }
    });
}

exports.PostProfileLogin = function (req, res) {
    Member.find({ login: req.params.login }, function (errors, members) {
        if (members.length > 0) {
            res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'member': members[0] });
        } else {
            errors.push("No members with this login in data base.");
            res.status(200).json({ 'route': '/profile/:login', 'errors': errors, 'member': {} });
        }
    });
}
//http://127.0.0.1:4242/member/update/:login
exports.getUpdateLogin = async function (req, res) {
    let membersList = await Member.find({ login: req.params.login });
    let errors = [];
    if (membersList.length > 0) {
        res.status(200).json({ 'route': '/update/:login', 'errors': errors, 'member': membersList[0] });
    } else {
        errors.push("No members with this login in data base.");
        res.status(200).json({ 'route': '/update/:login', 'errors': errors, 'member': {} });
    }
}

exports.PostUpdateLogin = async function (req, res) {
    console.log("je suis dans update post Member routes");
    let membersList = await Member.find({ login: req.params.login });
    let member = membersList[0];
    let errors = await funct.generateErrorsForUpdate(req, member);
    let login = req.body.login;
    let email = req.body.email;
    const filterLogin = { login: login };
    if (filterLogin == undefined || filterLogin == null) {
        errors.push("filterLogin data is not found");
        console.log("errors =" + errors);
        res.status(200).json({ 'route': '/update/:id', 'errors': errors });
        return;
    }
    if (errors.length > 0) {
        res.status(200).json({ 'errors': errors })
        console.log(errors);
        return;
    } else {
        const emailToUpdate = { email: email };
        const doc = await Member.findOneAndUpdate(filterLogin, emailToUpdate, { $set: { useFindAndModify: false } });
        doc.save().then(member => {
            res.status(200).json({ 'route': '/profile/:login', 'status': "OK", 'member': 'member updated successfully' });
        })
            .catch(err => {
                errors.push("Update not possible");
                res.status(200).json({ 'route': '/update/:login', 'status': 'KO', 'errors': errors });
            })
        console.log("errors =" + errors);
    }
}

exports.getList = async function (req, res) {
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
}
exports.GetID = function (req, res) {
    let id = req.params.id;
    Member.findById(id, function (err, members) {
        res.json(members);
    });
}