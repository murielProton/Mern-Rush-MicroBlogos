let Post = require('./model.post');
let Member = require('./model.member');

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
exports.generateErrorsForPostsCreate = async function generateErrorsForPostsCreate(req) {
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
exports.findListOfRecipients = async function findListOfRecipients(req) {
    listOfMayBeRecipient = findWordsStartingWithArobass(req.body.content);
    listOfMembers = await Member.find();
    return getListOfRecipientsFromLists(listOfMayBeRecipient, listOfMembers);
}
exports.findWordsStartingWithHashtag = function findWordsStartingWithHashtag(content) {
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
exports.findKeyWords = function findKeyWords(array) {
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
exports.findAllKeyWords = async function findAllKeyWords() {
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