import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";

export default class UpdateMember extends Component {

    constructor(props) {
        super(props);

        this.onChangeMemberLogin = this.onChangeMemberLogin.bind(this);
        this.onChangeMemberEmail = this.onChangeMemberEmail.bind(this);
        this.onChangeMemberPassword = this.onChangeMemberPassword.bind(this);
        this.onChangeMemberNewPassword = this.onChangeMemberNewPassword.bind(this);
        this.onChangeMemberAdmin = this.onChangeMemberAdmin.bind(this);
        this.onChangeMemberNewConfirmationPassword = this.onChangeMemberNewConfirmationPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            member_id: '',
            member_login: '',
            member_email: '',
            member_password: '',
            member_new_password: '',
            member_new_password_confirmation: '',
            member_admin: false,
            redirect: false,
            errors: []
        }
    }
    componentDidMount() {
        console.log(this.props.match.params.id);
        let login = this.props.match.params.id;
        console.log(this.props.match.params.id);
        this.setState({
            member_login: login
        });
        // get member => info via GET méthode
        let url = 'http://127.0.0.1:4242/member/update/' + login;
        axios.get(url)
            .then(response => {
                console.log("process get");
                console.log(response.data.member);
                let member = response.data.member;
                console.log(member);
                console.log( member.email);
                this.setState({
                    member_id: member._id,
                    member_login: member.login,
                    member_email: member.email,
                    member_old_password: '',
                    member_new_password: '',
                    member_new_password_confirmation: '',
                    member_admin: member.admin,
                    redirect: false
                });
            }).catch(errors => {
                //c'est comme cela que j'attrappe mes erreurs
            }); console.log(this.state.login);
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
    onChangeMemberNewPassword(e) {
        this.setState({
            member_new_password: e.target.value
        });
    }
    onChangeMemberNewConfirmationPassword(e) {
        this.setState({
            member_new_password_confirmation: e.target.value
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
        var changesToMember = {
            login: this.state.member_login,
            email: this.state.member_email,
            password: this.state.member_password,
            password_confirmation: this.state.member_password_confirmation,
            admin: this.state.member_admin
        };
        // On utilise lelogin de l'url et pas la version modifié.
        let login = this.props.match.params.id;
        // set member => info via POST méthode
        let url = 'http://127.0.0.1:4242/member/update/' + login;
        console.log(changesToMember);
        axios.post(url, changesToMember)
            .then(response => console.log(response.data));
        this.props.history.push('/');
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/member/list"/>;
        }
        return (
            <div style={{ marginTop: 10 }}>
                <h3>Update Profile  {this.props.match.params.id}</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Change your Login : </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.member_login}
                            onChange={this.onChangeMemberLogin}
                        />
                    </div>
                    <div className="form-group">
                        <label>Change your Email: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.member_email}
                            onChange={this.onChangeMemberEmail}
                        />
                    </div>
                    <div className="form-group">
                        <label>Old Password : </label>
                        <input type="password"
                            className="form-control"
                            value={this.state.member_password}
                            onChange={this.onChangeMemberPassword}
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password : </label>
                        <input type="password"
                            className="form-control"
                            value={this.state.member_new_password}
                            onChange={this.onChangeMemberNewPassword}
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password Confirmation: </label>
                        <input type="password"
                            className="form-control"
                            value={this.state.member_new_password_confirmation}
                            onChange={this.onChangeMemberNewConfirmationPassword}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="update" className="btn btn-light" />
                    </div>
                </form>
            </div>
        )
    }
}