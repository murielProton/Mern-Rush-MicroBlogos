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
import MyPosts from "./components/post-create.component";
import ThisPostDetails from "./components/posts-ID-details.component";
import ThisPostUpdate from "./components/post-edit.component";


function LinkUserConnected(props) {
  const isLoggedIn = props.isLoggedIn;
  let url = "/post/list/" + isLoggedIn;
  if (isLoggedIn) {
    return     <ul className="navbar-nav mr-auto">
      <li className="navbar-item">
        <Link to="/members" className="nav-link">Members List </Link>
      </li>
      <li className="navbar-item">
        <Link to="/post/create" className="nav-link">Create Post</Link>
      </li>
      <li className="navbar-item">
        <Link to={url} className="nav-link">My Posts</Link>
      </li>
      <li className="navbar-item">
        <Link to="/post/:id" className="nav-link">This Post Details</Link>
      </li>
      <li className="navbar-item">
        <Link to="/post/:id/update" className="nav-link">This Post Update</Link>
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
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" target="_blank">
              {this.state.login}
            </a>
            <div className="collpase navbar-collapse">
              <LinkUserConnected isLoggedIn={this.state.login} />
            </div>
          </nav>
          <br />
          <Route path="/members" component={MembersList} />
          <Route path="/editMember/:id" component={EditMember} />
          <Route path="/register" component={CreateMember} />
          <Route path="/login" render={(props) => <Login {...props} setLogin={this.setLogin} getLogin={this.getLogin} />} />
          <Route path="/logout" render={(props) => <Login {...props} setLogin={this.setLogin} getLogin={this.getLogin} logout={true}/>} />
          <Route path="/post/create" component={CreatePost} />
          <Route path="/post/my-list/:id" component={MyPosts} />
          <Route path="/post/details/:id" component={ThisPostDetails} />
          <Route path="/post/:id/update" component={ThisPostUpdate} />
        </div>
      </Router >
    );
  }
}

export default App;