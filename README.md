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

Si tu doute où mettre ton code, met le au plus près de l'arrivée du code que tu traite. Exemple si tu veux récupérer des info de la BDD, et les trier, mets toi du côté de la BDD = server.js. Si c'est l'info entré par l'utilisateur alors c'est de l'autre côté : component.js.
Après le peut de succès que j'ai eu à placer des fonctions pour reconnaître les @ et les # côté post-create.component.js ; j'abandonne et je place ce code dans le server.js.

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

Drop down menu ou menu déroulant
https://blog.campvanilla.com/reactjs-dropdown-menus-b6e06ae3a8fe

Dans un fichier .component.js, si j'affiche une liste. Pour me prémunir contre les erreur de liste undefined parce qu'elle n'a rien dedans, faire un if en début de render qui set la liste à vide.

req.params.**option of the field** => pour récupérer de la bd
req.body.**option of the field** => pour récupérer du formulaire

DELETE https://kb.objectrocket.com/mongo-db/mongoose-deleteone-922

CRUD 
https://medium.com/codingthesmartway-com-blog/the-mern-stack-tutorial-building-a-react-crud-application-from-start-to-finish-part-2-637f337e5d61

https://appdividend.com/2018/11/11/react-crud-example-mern-stack-tutorial/

SYNTAX pour redirect + :id ou login
        if (this.state.redirect) {
            var redirectLogin = this.props.match.params.id;
            return <Redirect to={`/member/profile/${redirectLogin}`} />;
        } else {---}
ici j'utilise this.props.match.params.id car c'est l'info refiler au départ pour afficher ma page, par l'utilisateur. et à cause d'une faut de nommage id === login


TEMPS REEL
il y a deux sortes de temps réel en informatique : l'actif et le passif.
L'actif :
while condition look at model et model répond. Le front comprend un observateur (implémenté dans le code) qui va chercher dans le front à interval régulier l'information.
Le Passif :
a chaque requête de l'utilisateur (physique), le  front va checher dans le back pour récupérer l'information.