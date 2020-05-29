const crypto = require('crypto');
let Member = require('./model.member');

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

exports.generateErrorsForRegister = async function generateErrorsForRegister(req) {
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
exports.toSha1 = function toSha1(password) {
    // On crée notre Hasher avec l'algo qu'on veux
    var shasum = crypto.createHash('sha1');
    // ce qu'on veux hasher
    shasum.update(password);
    // hex => Format de retour hex 012345679abcdef (base 16)
    return shasum.digest('hex');
}
async function passwordVerification(encryptedPassword, planPassword) {
    //vérifier si les deux mots de passe hacher sont identiques
    if (encryptedPassword == exports.toSha1(planPassword)) {
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
exports.generateErrorsForUpdate = async function generateErrorsForUpdate(req, member) {
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
    if (await passwordVerification(member.password, req.body.password) == false) {
        errors.push("Incorrect password.");
        console.log(errors);
    }
    return errors;
}

/* FIN des FONCTIONS UTILES MEMBERS--------------------------------------------------------------------*/
