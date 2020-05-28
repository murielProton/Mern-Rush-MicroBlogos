import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";

export default class UpdateMember extends Component {

    constructor(props) {
        super(props);

        this.onChangeMemberLogin = this.onChangeMemberLogin.bind(this);
        this.onChangeMemberEmail = this.onChangeMemberEmail.bind(this);
        this.onChangeMemberPassword = this.onChangeMemberPassword.bind(this);
        this.onChangeMemberAdmin = this.onChangeMemberAdmin.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            member_id: '',
            member_login: '',
            member_email: '',
            member_password: '',
            member_admin: false,
            redirect: false,
            errors: []
        }
    }
    componentDidMount() {
        let login = this.props.match.params.id;
        this.setState({
            member_login: login
        });
        // get member => info via GET méthode
        let url = 'http://127.0.0.1:4242/member/update/' + login;
        axios.get(url)
            .then(response => {
                let member = response.data.member;
                this.setState({
                    member_id: member._id,
                    member_login: member.login,
                    member_email: member.email,
                    member_password: response.data.password,
                    member_admin: member.admin,
                    redirect: false
                });
            }).catch(errors => {
                //c'est comme cela que j'attrappe mes erreurs
                console.log(this.state.login);
            });

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
    onChangeMemberAdmin(e) {
        this.setState({
            member_admin: e.target.value
        });
    }
    onSubmit(e) {
        e.preventDefault();
        //attention changdesToMember == body de req.body
        var changesToMember = {
            login: this.state.member_login,
            email: this.state.member_email,
            password: this.state.member_password
        };
        console.log("on submit " + this.state.member_password);
        // On utilise lelogin de l'url et pas la version modifié.
        let login = this.props.match.params.id;
        // set member => info via POST méthode
        let url = 'http://127.0.0.1:4242/member/update/' + login;
        console.log(changesToMember);
        console.log(url);
        axios.post(url, changesToMember)
            .then(res => {
                if (res.data.member === 'member updated successfully') {
                    console.log(changesToMember.login);
                    this.setState({
                        member_login: '',
                        member_email: '',
                        member_password: '',
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
                console.log(errors);
            });
    }
    render() {
        if (this.state.redirect) {
            var redirectLogin = this.props.match.params.id;
            return <Redirect to={`/member/profile/${redirectLogin}`} />;
        } else {
            return (
                <div style={{ marginTop: 10 }}>
                    <h3>Update Profile  {this.props.match.params.id}</h3>
                    {this.state.errors.map((item) =>
                        <h4>{item}</h4>
                    )}
                    <div>
                        Your Login : {this.state.member_login}
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Change your Email: </label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.member_email}
                                onChange={this.onChangeMemberEmail}
                            />
                        </div>
                        <div>
                            Please do confirm your identity by entering your password.
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
                            <input type="submit" value="update" className="btn btn-light" />
                        </div>
                    </form>
                </div>
            )
            // }
        }
    }
}