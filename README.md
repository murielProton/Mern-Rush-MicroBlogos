# Mern-Rush-MicroBlogos
Alone School Project => create a small blog in 8 days
site web à regarder avant de commencer le Rush
conseillé par le pdf
https://alligator.io/react/mern-stack-intro/
conseillé par Vétéa et les autres éléves
https://www.youtube.com/watch?v=MLMJ_uX3Ac
http://www.opentuto.com/single-page-application/

trouvé en tapant mern spa examples
https://dev.to/armelpingault/how-to-create-a-simple-and-beautiful-chat-with-mongodb-express-react-and-node-js-mern-stack-29l6
allows us to run both the server and the client in a single command line during our development mode:
npm install --save-dev concurrently
then use this commande 
npm run dev
fonctionne pas avec moi ????

Pour lancer l'un et l'autre serveur ouvrir troix onglets du terminal
l'un à la racine de ce document mongo --port 27042
l'un dans src - npm start
le dernier dans backend - à lancer d'abord - npm start
-------------------------------------------------------------------------------------------------------
les ports utilisés sont 4242 et 27042
nom de la bdd pourait être micro-blogos
lancer le shell mongo db c'est à la racine du projet commande : mongo --port 27042
si problème de port commande : sudo lsof -i -P -n | grep LISTEN
pour kill une utilisation d'un port : sudo kill -9 $(sudo lsof -t -i:**numéro du port à kill**)


------------------------------------------pratique-----------------------------------------------------
ATTENTION let errors = [], doit être déclarer dans chacunes des fonctions qui en ont besoin. pour justement éviter de récupérer l'array errors d'autres fonction plein.

pour ce qui est de la gestion de session passer par la varieble localStorage -> regarder la doc
https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage

Dans les Shema/Model Mongoose pas de - mais des _. Pas de Kebab case mais du snake case.

REGEX
    [] : The char class
    ^ : Inside the char class ^ is the negator when it appears in the beginning.
    \s : short for a white space
    - : a literal hyphen. A hyphen is a meta char inside a char class but not when it appears in the beginning or at the end.
début du regex en javaScript =/ à tester
fin du regex en javaScript =/ à tester

Code pour trouver les @ ou # dans un string
const testMessage = '#keyword #second fdezfez #trois @toto';
const myListHash =[];
const myListPeople =[];
//spit par espaces
testMessage.split(" ").forEach(element => {
    //récupérer que les mots commencant par #
		if(element.startsWith("#")){
          myListHash.push(element)
  			console.log(element);
		}
  		if(element.startsWith("@")){
          myListPeople.push(element)
  			console.log(element);
		}
	});
console.log(myListHash);
console.log(myListPeople);