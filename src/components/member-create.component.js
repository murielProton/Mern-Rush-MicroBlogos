import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";
//import { Redirect } from "react-router";


export default class CreateMember extends Component {

    constructor(props) {
        super(props);

        this.onChangeMemberLogin = this.onChangeMemberLogin.bind(this);
        this.onChangeMemberEmail = this.onChangeMemberEmail.bind(this);
        this.onChangeMemberPassword = this.onChangeMemberPassword.bind(this);
        this.onChangeMemberAdmin = this.onChangeMemberAdmin.bind(this);
        this.onChangeMemberConfirmationPassword = this.onChangeMemberConfirmationPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            member_login: '',
            member_email: '',
            member_password: '',
            member_admin: false,
            member_password_confirmation: '',
            redirect: false,
            errors: []
        }
    }

    onChangeMemberLogin(e) {
        this.setState({
            member_login: e.target.value
        });
    }

    onChangeMemberEmail(e) {
        this.setState({
            member_email: e.target.value
        });
    }
    onChangeMemberPassword(e) {
        this.setState({
            member_password: e.target.value
        });
    }
    onChangeMemberConfirmationPassword(e) {
        this.setState({
            member_password_confirmation: e.target.value
        });
    }
    onChangeMemberAdmin(e) {
        this.setState({
            member_admin: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        console.log("Form submitted:");
        console.log(`Member Login: ${this.state.member_login}`);
        console.log(`Member Email: ${this.state.member_email}`);
        console.log(`Member Password: ${this.state.member_password}`);
        console.log(`Member Admin: ${this.state.member_admin}`)
        var memberToCreate = {
            login: this.state.member_login,
            email: this.state.member_email,
            password: this.state.member_password,
            password_confirmation: this.state.member_password_confirmation,
            admin: this.state.member_admin
        };
        axios.post('http://127.0.0.1:4242/member/register', memberToCreate)
            .then(res => {
                if (res.data.member === 'member added successfully') {
                    console.log(memberToCreate.login);
                    this.setState({
                        member_login: '',
                        member_email: '',
                        member_password: '',
                        member_password_confirmation: '',
                        member_admin: false,
                        redirect: true
                    });

                } else {
                    this.setState({
                        errors: res.data.errors
                    });
                    console.log(res.data.errors);
                }
            }).catch(errors => {
                //c'est comme cela que j'attrappe mes erreurs

            });


    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/login' />;
        }
        return (
            <div style={{ marginTop: 10 }}>
                <h3>Register</h3>
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
                        <label>Email: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.member_email}
                            onChange={this.onChangeMemberEmail}
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
                        <label>Password Confirmation: </label>
                        <input type="password"
                            className="form-control"
                            value={this.state.member_password_confirmation}
                            onChange={this.onChangeMemberConfirmationPassword}
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