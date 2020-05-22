import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.onChangeMemberLogin = this.onChangeMemberLogin.bind(this);
        this.onChangeMemberPassword = this.onChangeMemberPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        if(props.logout){
            //On clean l'app et le localStorage (qui est conservé entre les refresh F5 ou restart)
            this.props.setLogin(null);
            localStorage.removeItem('login');
        }
        this.state = {
            login: '',
            password: '',
            errors: [],
            redirect: false,
        }
    }

    onChangeMemberLogin(e) {
        this.setState({
            login: e.target.value
        });
    }
    onChangeMemberPassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        console.log("login submitted:");
        console.log("Member Login: "+ this.state.login);
        //lorsqu'un utilisateur appuye sur submit les info qu'il m'a données entrent dans member
        const member = {
            login: this.state.login,
            password: this.state.password,
        }
        //j'envoi l'info member au server.js qui fera les test pour savoir si c'est OK
        axios.post('http://127.0.0.1:4242/member/login', member)
            //attentin de ce côté aucunes recherches dans le base de donnée !!!!!
            //toute interaction avec la base de donnée se fait coté backend dans server.js
            .then(res => {
                if (res.data.status == 'OK') {
                    console.log("You are successfully connected.");
                    localStorage.setItem('login', this.state.login);
                    this.setState({
                        login: '',
                        password: ''
                    });
                    this.setState({
                        login: localStorage.getItem('login'),
                        password:"",
                        redirect: true,
                    });
                    console.log("Display ");
                    this.props.setLogin(this.state.login);
                    console.log(this.props.getLogin());
                } else {
                    //this.setState({errors:res.data.errors}) récupère les errors côté server !!! YES !
                    this.setState({
                        errors:res.data.errors
                    });
                    console.log("Fail to connect.")
                    console.log(res.data.errors);
                }
            }).catch(errors => {
                console.log(errors);
                //c'est comme cela que j'attrappe mes erreurs
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/post/create' />;
        }
        return (
            <div style={{ marginTop: 10 }}>
                <h3>Login</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Login : </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.member_login}
                            onChange={this.onChangeMemberLogin}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password : </label>
                        <input type="password"
                            className="form-control"
                            value={this.state.member_password}
                            onChange={this.onChangeMemberPassword}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Log in" className="btn btn-light" />
                    </div>
                </form>
            </div>
        )
    }
}