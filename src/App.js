/*to start this one use npm start
Attention pas d'ettat client serveur API must be restfull pas de gestion des session coter express.
*/

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import MembersList from "./components/members-list.component";
import EditMember from "./components/member-edit.component";
import CreateMember from "./components/member-create.component";
import Login from "./components/login.component";
import CreatePost from "./components/post-create.component";
import ListOfPosts from "./components/posts-list.component";
import MyPosts from "./components/posts-list-ID.component";
import MyMail from "./components/posts-list-ID-received.component";
import SearchByKeyWords from "./components/post-search-key-word.component";


function LinkUserConnected(props) {
  const isLoggedIn = props.isLoggedIn;
  //const keyWord = props.
  let urlMyBlog = "/my-blog/" + isLoggedIn;
  let urlMyMail = "/post/received-list/" + isLoggedIn;
  //let urlSearchByKeyWords = "/post/search-by-key-words/" + keyWord;
  if (isLoggedIn) {
    return     <ul className="navbar-nav mr-auto">
      <li className="navbar-item">
        <Link to="/member/list" className="nav-link">Volée </Link>
      </li>
      <li className="navbar-item">
        <Link to="/post/create" className="nav-link">Glatir</Link>
      </li>
      <li className="navbar-item">
        <Link to="/post/list" className="nav-link">Glatits</Link>
      </li>
      <li className="navbar-item">
        <Link to={urlMyBlog} className="nav-link">Mon Blog</Link>
      </li>
      <li className="navbar-item">
        <Link to={urlMyMail} className="nav-link">Reçuts</Link>
      </li>
      <li className="navbar-item">
        <Link to="/post/search-by-key-words/" className="nav-link">Mots Clefs</Link>
      </li>
      <li className="navbar-item">
      <Link to="/logout" className="nav-link">Logout </Link>
    </li>
    </ul>;
  } else {
    return <ul className="navbar-nav mr-auto"><li className="navbar-item">
      <Link to="/login" className="nav-link">Login </Link>
    </li>
      <li className="navbar-item">
        <Link to="/register" className="nav-link">Register</Link>
      </li>
    </ul>;
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.setLogin = this.setLogin.bind(this);
    this.getLogin = this.getLogin.bind(this);
    this.state = { login: null }
    if (localStorage.getItem('login')) {
      this.state = { login: localStorage.getItem('login') }
    }
  }

  setLogin(login) {
    console.log("Old Login :" + this.state.login);
    //Déclanche un re-render SETSTATE et non this.state
    this.setState({ login: login });
    console.log("New Login :" + this.state.login);
  }
  getLogin(login) {
    return this.state.login;
  }

  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">Micro-Blogos
            <a className="navbar-brand" target="_blank">
              {this.state.login}
            </a>
            <div className="collpase navbar-collapse">
              <LinkUserConnected isLoggedIn={this.state.login} />
            </div>
          </nav>
          <br />
          <Route path="/member/list" component={MembersList} />
          <Route path="/editMember/:id" component={EditMember} />
          <Route path="/register" component={CreateMember} />
          <Route path="/login" render={(props) => <Login {...props} setLogin={this.setLogin} getLogin={this.getLogin} />} />
          <Route path="/logout" render={(props) => <Login {...props} setLogin={this.setLogin} getLogin={this.getLogin} logout={true}/>} />
          <Route path="/post/create" component={CreatePost} />
          <Route path="/post/list" component={ListOfPosts} />
          <Route path="/my-blog/:id" component={MyPosts} />
          <Route path="/post/received-list/:id" component={MyMail} />
          <Route path="/post/search-by-key-words" component={SearchByKeyWords} />
        </div>
      </Router >
    );
  }
}

export default App;